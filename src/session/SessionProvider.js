import React, { useState, useEffect, useMemo } from 'react'
import SessionContext from './SessionContext'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-unfetch'

/**
 * Fetches user session data from a specific URL and provides it to descendant components via `SessionContext`.
 *
 * User and session data such as the number of items in the cart, the user's name, and email should always be
 * fetched when the app mounts, not in `getInitialProps`, otherwise the SSR result would not be cacheable
 * since it would contain user-specific data.
 */
export default function SessionProvider({ url, children }) {
  const [session, setSession] = useState(null)

  const context = useMemo(() => {
    return {
      session,
      actions: {
        updateCartCount(quantity) {
          setSession({
            ...session,
            itemsInCart: quantity,
          })
        },
      },
    }
  }, [session])

  useEffect(() => {
    async function fetchSession() {
      setSession(await fetch(url).then(res => res.json()))
    }

    if (url) fetchSession()
  }, [url])

  return <SessionContext.Provider value={context}>{children}</SessionContext.Provider>
}

SessionProvider.propTypes = {
  /**
   * A URL to fetch when the app mounts which establishes a user session and returns user and cart data
   * to be made available via `react-storefront/session/SessionContext`.
   */
  url: PropTypes.string,
}

SessionProvider.defaultProps = {}
