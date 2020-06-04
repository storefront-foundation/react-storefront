import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import useIntersectionObserver from './hooks/useIntersectionObserver'

import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { SheetsRegistry } from 'jss'

let registries = []

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
      {registries.map(registry => {

        // Apply these styles only to the wrapped component
        for (let sheet of registry.registry) {
          for (let rule of sheet.rules.index) {
            rule.selectorText = `#${registry.id} ${rule.selectorText}`
          }
        }

        return (
          <style
            key={registry.id}
            id={registry.id}
            dangerouslySetInnerHTML={{ __html: registry.toString() }}
          />
        )
      })}
    </>
  )
}

function LazyStylesProvider({ id, children }) {
  const generateClassName = createGenerateClassName()
  const registry = new SheetsRegistry()
  registry.id = id
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

function LazyHydrateInstance({ id, className, ssrOnly, children, on, ...props }) {
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

  function hydrate() {
    setHydrated(true)
    // Remove the server side generated stylesheet
    const stylesheet = window.document.getElementById(id)
    if (stylesheet) {
      stylesheet.remove()
    }
  }

  useEffect(() => {
    setHydrated(isHydrated())
  }, [props.hydrated, ssrOnly])

  if (on === 'visible') {
    useIntersectionObserver(
      // As root node does not have any box model, it cannot intersect.
      () => childRef.current.children[0],
      (visible, disconnect) => {
        if (visible) {
          hydrate()
          disconnect()
        }
      },
      [],
      // Fallback to eager hydration
      () => {
        hydrate()
      },
    )
  }

  useEffect(() => {
    if (hydrated) return

    if (on === 'click') {
      childRef.current.addEventListener('click', hydrate, {
        once: true,
        capture: true,
        passive: true,
      })
    }

    return () => {
      if (on === 'click') {
        childRef.current.removeEventListener('click', hydrate)
      }
    }
  }, [hydrated, on])

  if (hydrated) {
    return (
      <div ref={childRef} id={id} className={className} style={{ display: 'contents' }}>
        {children}
      </div>
    )
  } else {
    return (
      <div
        ref={childRef}
        id={id}
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
  const id = props.id || `jss-lazy-${registries.length}`
  return (
    <LazyHydrateInstance {...props} id={id}>
      <LazyStylesProvider id={id}>{children}</LazyStylesProvider>
    </LazyHydrateInstance>
  )
}

LazyHydrate.propTypes = {
  // Identification of component
  id: PropTypes.string,
  // Control the hydration of the component externally with this prop
  hydrated: PropTypes.bool,
  // Force component to never hydrate
  ssrOnly: PropTypes.bool,
  // Event to trigger hydration
  on: PropTypes.oneOf(['visible', 'click']),
}

export default LazyHydrate
