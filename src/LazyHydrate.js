import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import useIntersectionObserver from './hooks/useIntersectionObserver'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { SheetsRegistry } from 'jss'

const fuiEvents = ['mouseover', 'touchstart', 'scroll']
const touchEvents = ['touchstart', 'mouseover']
const eventOptions = { once: true, capture: true, passive: true }

let registries = []

// Only used for testing
export function getRegistryCount() {
  return registries.length
}

/*
  This component renders the server side rendered stylesheets for the
  lazy hydrated components. Once they become hydrated, these stylesheets
  will be removed.
*/
export function LazyStyles() {
  let styles = null
  try {
    styles = (
      <>
        {registries.map(registry => {
          function applyScope(sheet) {
            for (let rule of sheet.rules.index) {
              if (rule.type === 'conditional') {
                applyScope(rule)
              } else {
                rule.selectorText = `#${registry.id} ${rule.selectorText}`
              }
            }
          }

          // Apply these styles only to the wrapped component
          for (let sheet of registry.registry) {
            applyScope(sheet)
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
  } finally {
    // Clear registeries so we do not leak memory
    registries = []
  }
  return styles
}

function LazyStylesProvider({ id, children }) {
  const generateClassName = createGenerateClassName({
    productionPrefix: `lazy-${id}`,
  })
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
      // If rendering after client side navigation
      if (window.__clientDidNavigate) return true
      // return true
      if (ssrOnly) return false
      return !!props.hydrated
    } else {
      return true
    }
  }

  const childRef = useRef(null)
  const [hydrated, setHydrated] = useState(isHydrated())

  function hydrate() {
    if (!hydrated) {
      setHydrated(true)
      // Remove the server side generated stylesheet
      const stylesheet = window.document.getElementById(id)

      if (stylesheet) {
        stylesheet.remove()
      }
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

    const handler = () => {
      hydrate()
      clearEventListeners()
    }

    const clearEventListeners = () => {
      if (on === 'touch') {
        touchEvents.forEach(type => {
          childRef.current.removeEventListener(type, handler, eventOptions)
        })
      } else if (on === 'fui') {
        fuiEvents.forEach(type => {
          window.removeEventListener(type, handler, eventOptions)
        })
      }
    }

    if (on === 'fui') {
      fuiEvents.forEach(type => window.addEventListener(type, handler, eventOptions))
    } else if (on === 'touch') {
      touchEvents.forEach(type => childRef.current.addEventListener(type, handler, eventOptions))
    }

    return clearEventListeners
  }, [on])

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
 * LazyHydrate a component based on a specified trigger
 *
 * Example usage:
 *
 *  <LazyHydrate id="foo">
 *    <div>some expensive component</div>
 *  </LazyHydrate>
 *
 */

function LazyHydrate({ children, ...props }) {
  return (
    <LazyHydrateInstance {...props}>
      <LazyStylesProvider {...props}>{children}</LazyStylesProvider>
    </LazyHydrateInstance>
  )
}

LazyHydrate.defaultProps = {
  on: 'visible',
}

LazyHydrate.propTypes = {
  // Identification of component
  id: PropTypes.string.isRequired,
  // Control the hydration of the component externally with this prop
  hydrated: PropTypes.bool,
  // Force component to never hydrate
  ssrOnly: PropTypes.bool,
  /* 
    Event to trigger hydration
    eventOptions
      - `visible` triggers hydration when component comes into the viewport
      - `touch` triggers hydration on touchstart or mouseover
      - `fui` (default) triggers hydration when user first interacts with page
  */
  on: PropTypes.oneOf(['visible', 'touch', 'fui']),
}

export default LazyHydrate
