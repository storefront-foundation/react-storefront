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
 * ```js
 * router.get('/p/:id',
 *   cache({
 *     server: {
 *       maxAgeSeconds: 300 // cache for 5 minutes on the server,
 *       key: createCustomCacheKey() // split cache by user-agent header, currency, and location (with bucketing), and exclude the ?uid search parameter from the cache key
 *         .addHeader('user-agent')
 *         .excludeQueryParameters(['uid'])
 *         .addCookie('currency')
 *         .addCookie('location', cookie => {
 *           cookie.partition('na').byPattern('us|ca')
 *           cookie.partition('eur').byPattern('de|fr|ee')
 *         })
 *     },
 *     client: true // cache in the service worker based on the settings passed to router.configureClientCache()
 *   })
 *   fromClient({ view: 'Product' }),
 *   fromServer('./product.js'),
 * )
 * ```
 *
 * @param {Object} options
 * @param {Number} options.server
 * @param {Number} options.server.maxAgeSeconds The number of seconds the result should be cached on
 *  the server.  The maxAgeSeconds key is required when specifying a server config.
 * @param {Object} options.server.key A custom cache key to override the default caching behavior.  Use this to split the cache by
 *  headers and cookies, and/or normalize the cache by removing specific query parameters.
 * @param {Boolean} options.client Set to true to cache on the client based on the configuration defined
 *  by router.configureClientCache(). Defaults to false.
 * @return {Object}
 */
export default function cache({ server, client }) {
  return {
    type: 'cache',
    client,
    server,
    runOn: {
      server: true,
      client: true
    },
    fn: (params, request, response) => {
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

        if (typeof server.surrogateKey === 'function') {
          response.set(SURROGATE_KEY, server.surrogateKey(params, request))
        }
      }
    }
  }
}
