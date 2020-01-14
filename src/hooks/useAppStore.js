import { useState, useEffect } from 'react'

/**
 * Provides a store for app-level data that is shared by all pages, such as
 * the main menu, nav, and footer items.
 * @param {Object} props Data fetched from getInitialProps, which should include an `appData` key.
 * @return {Array} A state and an updater function, similar to the result of React's `useState` hook.  The state will contain the value of appData returned by getInitialProps
 */
export default function useAppStore(props) {
  const result = useState(props.appData)
  const [_, setState] = result

  useEffect(() => {
    if (props.appData) {
      setState(props.appData)
    }
  }, [props.appData])

  return result
}
