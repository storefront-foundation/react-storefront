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
 *     edge: {
 *       maxAgeSeconds: 300 // cache for 5 minutes on the edge,
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
 * @param {Number} options.edge
 * @param {Number} options.edge.maxAgeSeconds The number of seconds the result should be cached on
 *  the server.  The maxAgeSeconds key is required when specifying a server config.
 * @param {Object} options.edge.key A custom cache key to override the default caching behavior.  Use `createCustomCacheKey()` to split the cache by
 *  headers and cookies, and/or normalize the cache by removing specific query parameters.
 * @param {Function} options.edge.surrogateKey A function that is passed the route params and the request and returns a surrogate key under which to cache the response.
 * @param {Boolean} options.client Set to true to cache on the client based on the configuration defined
 *  by router.configureClientCache(). Defaults to false.
 * @return {Object}
 */
export default function cache({ edge, server, client }) {
  if (server)
    console.warn(
      'Deprecation warning: cache({ server }) is deprecated in favor of cache({ edge }) and will be removed in a future version of React Storefront.  Please update your Router definition.'
    )

  if (!edge) edge = server // provide backwards compatibility for server, which we've renamed edge

  return {
    type: 'cache',
    client,
    edge,
    server: edge,
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
      } else if (edge) {
        if (edge.maxAgeSeconds) {
          // For fetch to read
          env.shouldSendCookies =
            edge.key && edge.key.getCookieNames ? edge.key.getCookieNames() : false

          response.relayUpstreamCookies(false)
          response.cacheOnServer(edge.maxAgeSeconds)
        }

        if (typeof edge.surrogateKey === 'function') {
          response.set(SURROGATE_KEY, edge.surrogateKey(params, request))
        }
      }
    }
  }
}
