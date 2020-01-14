import React, { useEffect } from 'react'

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
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      // if intersectionRatio is 0, the element is out of view and we do not need to do anything.
      cb(entries[0].intersectionRatio > 0, () => observer.disconnect())
    })

    const ref = getRef()

    if (ref && ref.current) {
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, deps)
}
