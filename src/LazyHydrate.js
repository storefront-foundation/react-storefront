import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { SheetsRegistry } from 'jss'

let registries = []
const generateClassName = createGenerateClassName()

export function clearLazyHydrateRegistries() {
  registries = []
}

/*
  This component renders the server side rendered stylesheets for the
  lazy hydrated components. Once they become hydrated, these stylesheets
  will be removed.
*/
export function LazyStyleElements() {
  return (
    <>
      {registries.map((registry, index) => {
        const id = `jss-lazy-${index}`
        return <style key={id} id={id} dangerouslySetInnerHTML={{ __html: registry.toString() }} />
      })}
    </>
  )
}

function LazyStylesProvider({ children }) {
  const registry = new SheetsRegistry()
  registries.push(registry)
  return (
    <StylesProvider
      sheetsManager={new Map()}
      serverGenerateClassName={generateClassName}
      sheetsRegistry={registry}
    >
      {children}
    </StylesProvider>
  )
}

const isBrowser = () => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.IS_BROWSER === 'true'
  }
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
  )
}

// Used for detecting when the wrapped component becomes visible
const io =
  isBrowser() && IntersectionObserver
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.dispatchEvent(new CustomEvent('visible'))
          }
        })
      })
    : null

function LazyHydrateInstance({ className, ssrOnly, children, on, index, ...props }) {
  function isHydrated() {
    if (isBrowser()) {
      if (ssrOnly) return false
      return props.hydrated
    } else {
      return true
    }
  }

  const childRef = useRef(null)
  const [hydrated, setHydrated] = useState(isHydrated())

  useEffect(() => {
    setHydrated(isHydrated())
  }, [props.hydrated, ssrOnly])

  useEffect(() => {
    if (hydrated) return

    function hydrate() {
      setHydrated(true)
      // Remove the server side generated stylesheet
      const stylesheet = window.document.getElementById(`jss-lazy-${index}`)
      if (stylesheet) {
        stylesheet.remove()
      }
    }

    let el
    if (on === 'visible') {
      if (io && childRef.current.childElementCount) {
        // As root node does not have any box model, it cannot intersect.
        el = childRef.current.children[0]
        io.observe(el)
      }
    }

    childRef.current.addEventListener(on, hydrate, {
      once: true,
      capture: true,
      passive: true,
    })

    return () => {
      if (el) io.unobserve(el)
      childRef.current.removeEventListener(on, hydrate)
    }
  }, [hydrated, on])

  if (hydrated) {
    return (
      <div ref={childRef} style={{ display: 'contents' }} className={className}>
        {children}
      </div>
    )
  } else {
    return (
      <div
        ref={childRef}
        className={className}
        style={{ display: 'contents' }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: '' }}
      />
    )
  }
}

/**
 * LazyHydrate
 *
 * Example:
 *
 *  <LazyHydrate on="visible">
 *    <div>some expensive component</div>
 *  </LazyHydrate>
 *
 */

function LazyHydrate({ children, ...props }) {
  return (
    <LazyHydrateInstance {...props} index={registries.length}>
      <LazyStylesProvider>{children}</LazyStylesProvider>
    </LazyHydrateInstance>
  )
}

LazyHydrate.propTypes = {
  // Control the hydration of the component externally with this prop
  hydrated: PropTypes.bool,
  // Force component to never hydrate
  ssrOnly: PropTypes.bool,
  // Event to trigger hydration
  on: PropTypes.oneOf(['visible', 'click']),
}

export default LazyHydrate
