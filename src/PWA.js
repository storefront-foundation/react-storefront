import React, { useEffect, useMemo, useRef, useState } from 'react'
import PWAContext from './PWAContext'
import PropTypes from 'prop-types'
import ErrorBoundary from './ErrorBoundary'
import { makeStyles } from '@material-ui/core/styles'
import LinkContextProvider from './link/LinkContextProvider'
import useSimpleNavigation from './router/useSimpleNavigation'
import './hooks/useTraceUpdate'
import './profile'

export const styles = theme => ({
  '@global': {
    body: {
      '-webkit-tap-highlight-color': 'transparent',
    },
    a: {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFPWA' })

export default function PWA({ children, errorReporter }) {
  useStyles()
  const thumbnail = useRef(null)
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine)

  const context = useMemo(
    () => ({
      thumbnail,
      offline,
    }),
    [offline],
  )

  // enable client-side navigation when the user clicks a simple HTML anchor element
  useSimpleNavigation()

  useEffect(() => {
    context.hydrating = false

    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <PWAContext.Provider value={context}>
      <LinkContextProvider>
        <ErrorBoundary onError={errorReporter}>{children}</ErrorBoundary>
      </LinkContextProvider>
    </PWAContext.Provider>
  )
}

PWA.propTypes = {
  /**
   * A function to be called whenever an error occurs.  Use this to report errors
   * to a service like Airbrake or Rollbar.
   */
  errorReporter: PropTypes.func,
}
