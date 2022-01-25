import { useEffect } from 'react'

function getElement(ref) {
  if (ref && ref.current) {
    return ref.current
  }
  return ref
}

/**
 * Calls a provided callback when the provided element moves into or out of the viewport.
 *
 * Example:
 *
 * ```js
 *  import React, { useRef, useCallback } from 'react'
 *  import useIntersectionObserver from 'react-storefront/hooks/useIntersectionObserver'
 *
 *  function MyComponent() {
 *    const ref = useRef(null)
 *
 *    const onVisibilityChange = useCallback((visible, disconnect) => {
 *      if (visible) {
 *        // do some side effect here
 *        // and optionally stop observing by calling: disconnect()
 *      }
 *    }, [])
 *
 *    useIntersectionObserver(() => ref, onVisibilityChange, [])
 *    return <div ref={ref}></div>
 *  }
 *
 * ```
 *
 * @param {Function} getRef A function that returns a ref pointing to the element to observe OR the element itself
 * @param {Function} cb A callback to call when visibility changes
 * @param {Object[]} deps The IntersectionObserver will be updated to observe a new ref whenever any of these change
 * @param {Function} notSupportedCallback Callback fired when IntersectionObserver is not supported
 */
export default function useIntersectionObserver(getRef, cb, deps, notSupportedCallback) {
  useEffect(() => {
    if (!window.IntersectionObserver) {
      notSupportedCallback &&
        notSupportedCallback(new Error('IntersectionObserver is not available'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      // if intersectionRatio is 0, the element is out of view and we do not need to do anything.
      cb(entries[0].intersectionRatio > 0, () => observer.disconnect())
    })
    const el = getElement(getRef())
    if (el instanceof Element) {
      observer.observe(el)
      return () => observer.disconnect()
    }
  }, deps)
}
