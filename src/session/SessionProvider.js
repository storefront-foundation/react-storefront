import React, { useState, useEffect, useMemo } from 'react'
import SessionContext from './SessionContext'
import PropTypes from 'prop-types'
import fetch from '../fetch'

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
        /**
         * Signs an existing user in
         * @param {Object} options
         * @param {String} options.email The user's email
         * @param {String} options.password The user's password
         */
        async signIn({ email, password }) {
          const response = await fetch('/api/signIn')
          const { cart, ...others } = await response.json()
          setSession(session => ({ ...session, cart, ...others }))
          return { cart }
        },

        /**
         * Signs the user out
         */
        async signOut() {
          const response = await fetch('/api/signOut')
          setSession({ ...session, cart: undefined, ...(await res.json()) })
        },

        /**
         * Signs the user up for a new account
         * @param {Object} options
         * @param {String} firstName The user's first name
         * @param {String} lastName The user's last name
         * @param {String} fullName The user's full name - use either fullName or firstName and lastName depending on what the underlying platform requires
         * @param {String} email The user's email address
         * @param {String} password The user's password
         * @param {Object} ...others Additional data to submit to api/signUp
         */
        async signUp({ firstName, lastName, email, password, ...others }) {
          const response = await fetch('/api/signUp', {
            method: 'post',
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              password,
              ...others,
            }),
          })
        },

        /**
         * Adds items to the cart
         * @param {Object} options
         * @param {String} sku The product sku
         * @param {String} quantity The quantity to add to the cart
         * @param {Object} ...others Additional data to submit to api/addToCart
         */
        async addToCart({ sku, quantity, ...others }) {
          const response = await fetch('/api/addToCart', {
            method: 'post',
            body: JSON.stringify({
              sku,
              quantity,
              cartId: cart.id,
              ...others,
            }),
          })

          const { cart, ...others } = await response.json()
          setSession({ ...session, cart, ...others })
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

SessionProvider.defaultProps = {
  url: '/api/session',
}
