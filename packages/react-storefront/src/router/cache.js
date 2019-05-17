/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import { SURROGATE_KEY } from './headers'

/**
 * Specifies that the result of a route should be cached.  This handler must come before fromServer.
 *
 * Example:
 *
 *    router.get('/p/:id',
 *      cache({
 *        server: {
 *          maxAgeSeconds: 300 // cache for 5 minutes on the server,
 *          key: (request, defaults) => ({ // cache result separately for mobile and desktop user agents
 *            ...defaults,
 *            mobile: ['iOS', 'Android'].includes(
 *              new UAParser(request.headers['user-agent']).getOS().name
 *            )
 *          })
 *        },
 *        client: true // cache in the service worker based on the settings passed to router.configureClientCache()
 *      })
 *      fromClient({ view: 'Product' }),
 *      fromServer('./product.js'),
 *    )
 *
 * @param {Object} options
 * @param {Number} options.server
 * @param {Number} options.server.maxAgeSeconds The number of seconds the result should be cached on the server.  The maxAgeSeconds key is required when specifying a server config.
 * @param {Function} options.server.key A function to compute a custom cache key for server-side caching.  The function is
 *  passed the request object and a defaults object containing the key/value pairs that make up the default cache key.  This function is optional when specifying a server config.
 * @param {Boolean} options.client Set to true to cache on the client based on the configuration defined by router.configureClientCache(). Defaults to false.
 * @return {Object}
 */
export default function cache({ server, client }) {
  const getSurrogateKey = route => {
    if (typeof server.surrogateKey === 'string') {
      return server.surrogateKey
    } else if (route) {
      return route.declaredPath
    }
  }

  return {
    type: 'cache',
    client,
    server,
    runOn: {
      server: true,
      client: true
    },
    getSurrogateKey,
    fn: (params, request, response, { route } = {}) => {
      if (
        process.env.MOOV_RUNTIME === 'server' &&
        process.env.MOOV_ENV === 'development' &&
        request.method.toLowerCase() !== 'get'
      ) {
        throw new Error(
          `Invalid use of cache handler for ${
            request.method
          } request. Only GET requests can be cached.`
        )
      }

      if (process.env.MOOV_RUNTIME === 'client') {
        if (client) {
          response.cacheOnClient(true)
        }
      } else if (server) {
        if (server.maxAgeSeconds) {
          // For fetch to read
          env.shouldSendCookies = false
          response.relayUpstreamCookies(false)
          response.cacheOnServer(server.maxAgeSeconds)
        }

        const surrogateKey = getSurrogateKey(route)

        if (surrogateKey) {
          response.set(SURROGATE_KEY, surrogateKey)
        }
      }
    }
  }
}
