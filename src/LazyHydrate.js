import React from 'react'

import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { SheetsRegistry } from 'jss'

const registries = []

const generateClassName = createGenerateClassName()

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

function LazyHydrate({ hydrated, ssrOnly, children, on, index, ...rest }) {
  const childRef = React.useRef(null)
  const [_hydrated, setHydrated] = React.useState(!isBrowser)

  React.useEffect(() => {
    if (ssrOnly || hydrated) return

    function hydrate() {
      setHydrated(true)
    }

    if (hydrated || _hydrated) {
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

export default function({ children, ...props }) {
  return (
    <LazyHydrate {...props} index={registries.length}>
      <LazyStylesProvider>{children}</LazyStylesProvider>
    </LazyHydrate>
  )
}
