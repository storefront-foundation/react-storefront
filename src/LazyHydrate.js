import React from 'react'
import PropTypes from 'prop-types'

import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { SheetsRegistry } from 'jss'

const registries = []
const generateClassName = createGenerateClassName()

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

const isBrowser =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'

// Used for detecting when the wrapped component becomes visible
const io =
  isBrowser && IntersectionObserver
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.dispatchEvent(new CustomEvent('visible'))
          }
        })
      })
    : null

function LazyHydrateInstance({ hydrated, ssrOnly, children, on, index, ...rest }) {
  const childRef = React.useRef(null)
  const [_hydrated, setHydrated] = React.useState(!isBrowser)

  React.useEffect(() => {
    if (ssrOnly || hydrated) return

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
  }, [])

  if (hydrated || _hydrated) {
    return (
      <div ref={childRef} style={{ display: 'contents' }} {...rest}>
        {children}
      </div>
    )
  } else {
    return (
      <div
        ref={childRef}
        style={{ display: 'contents' }}
        suppressHydrationWarning
        {...rest}
        dangerouslySetInnerHTML={{ __html: '' }}
      />
    )
  }
}

/**
 * LazyHydrate
 *
 * @param {*} param0
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
  // Force component to never hydrate
  ssrOnly: PropTypes.bool,
  // Event to trigger hydration
  on: PropTypes.oneOf(['visible', 'click']),
}

export default LazyHydrate
