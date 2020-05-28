import { useEffect } from 'react'
import createIntersectionObserver from '../utils/createIntersectionObserver'

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
 * @param {Function} getRef A function that returns a ref pointing to the element to observe
 * @param {Function} cb A callback to call when visibility changes
 * @param {Object[]} deps The IntersectionObserver will be updated to observe a new ref whenever any of these change
 */
export default function useIntersectionObserver(getRef, cb, deps) {
  if (!window.IntersectionObserver) throw new Error('IntersectionObserver is not available')
  useEffect(() => {
    const ref = getRef()
    if (ref && ref.current) {
      const observer = createIntersectionObserver(ref.current, cb)
      return () => observer.disconnect()
    }
  }, deps)
}
