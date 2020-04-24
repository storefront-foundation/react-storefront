import { registerRoute } from 'workbox-routing'
import { skipWaiting, clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

/**
 * Configures prefetching and caching of static assets as well as caching of api requests
 * in the service worker.
 *
 * **Example**
 *
 * ```js
 *  import { configureServiceWorker } from 'react-storefront/sw'
 *
 *  const maxAgeSeconds = 60 * 60 // 1 hour
 *
 *  configureServiceWorker({
 *    api: [
 *      { path: '/api/[version]/p/[productId]', maxAgeSeconds },
 *      { path: '/api/[version]/s/[subcategoryId]', maxAgeSeconds },
 *      { path: '/api/[version]/', maxAgeSeconds },
 *    ],
 *  })
 * ```
 *
 * @param {Object} config
 * @param {Object} config.api An array of objects with the following properties:
 * @param {Object} config.api.maxAgeSeconds The time to live in seconds for api requests
 * @param {Object} config.api.paths The api paths to cache
 * @param {Object} config.api.statuses Only responses with these statuses will be cached. Defaults to only caching 200s.
 */
export default function configureServiceWorker(config) {
  skipWaiting()
  clientsClaim()
  precacheAndRoute(self.__WB_MANIFEST || [])

  if (config.api) {
    cacheAPIRequests(config.api)
  }
}

/**
 * Creates worbox routes for api routes
 * @param {Object[]} api
 */
function cacheAPIRequests(api = []) {
  for (let { path, maxAgeSeconds, statuses = [200] } of api) {
    const url = new RegExp(`${self.origin}${nextRouteToRegex(path)}`, 'i')

    log('Caching API route', path, url)

    registerRoute(
      url, // we need to remove the ^ or requests will never match
      new CacheFirst({
        cacheName: 'api',
        plugins: [
          new CacheableResponsePlugin({ statuses }),
          new ExpirationPlugin({ maxAgeSeconds }),
        ],
      }),
    )
  }
}

/**
 * Converts next clean route syntax to a regular expression
 * @param {String} route A next.js route pattern
 * @return {String}
 */
function nextRouteToRegex(route) {
  return route.replace(/\[[^\]]+\]/gi, '[^/]+') + '($|\\?.*$)'
}

/**
 * Stylized console.log
 * @param  {...any} message
 */
function log(...message) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      '%creact-storefront service-worker',
      'background: #43a047; color: #ffffff; font-weight:bold; padding: 3px 5px; border-radius: 5px',
      ...message,
    )
  }
}
