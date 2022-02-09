import React, { useEffect, useMemo, useRef, useState } from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import PWAContext from './PWAContext'
import ErrorBoundary from './ErrorBoundary'
import LinkContextProvider from './link/LinkContextProvider'
import useSimpleNavigation from './router/useSimpleNavigation'
import './hooks/useTraceUpdate'
import './profile'

const PREFIX = 'RSFPWA'

const classes = {
  body: `${PREFIX}-body`,
  a: `${PREFIX}-a`,
}

const StyledPWAContextProvider = styled(PWAContext.Provider)(({ theme }) => ({
  [`& .${classes.body}`]: {
    'WebkitTapHighlightColor?': 'transparent',
  },

  [`& .${classes.a}`]: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}))

export {}

export default function PWA({ children, errorReporter }) {
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
    <StyledPWAContextProvider value={context}>
      <LinkContextProvider>
        <ErrorBoundary onError={errorReporter}>{children}</ErrorBoundary>
      </LinkContextProvider>
    </StyledPWAContextProvider>
  )
}

PWA.propTypes = {
  /**
   * A function to be called whenever an error occurs.  Use this to report errors
   * to a service like Airbrake or Rollbar.
   */
  errorReporter: PropTypes.func,
}
