import { useState, useEffect, useRef } from 'react'

/**
 * The same as React's `useState`, but automatically updated when the specified prop value changes.
 * @param {Object} prop
 * @return {Array} The same as what's returned from React's useState hook.
 */
export default function useStateFromProp(prop) {
  const state = useState(prop)
  const [_value, setValue] = state
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) {
      setValue(prop)
    }
    mounted.current = true
  }, [prop])

  return state
}
