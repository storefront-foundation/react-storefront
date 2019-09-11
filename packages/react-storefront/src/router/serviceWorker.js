/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import getAPIVersion from './getAPIVersion'

/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * Cache content using the service worker.  If content is not supplied, the service worker will fetch
 * the content from the server
 * @param {String} path The URI path of the request
 * @param {String} cacheData The data to cache
 */
export async function cache(path, cacheData) {
  if (await waitForServiceWorkerController()) {
    const { apiVersion } = window.moov || {}

    if (window.moov.router && !window.moov.router.willCacheOnClient({ path })) {
      // Never cache a path unless it matches a route with a cache handler
      // otherwise we could wind up caching pages like the cart that are not cacheable
      return
    }

    if (cacheData) {
      navigator.serviceWorker.controller.postMessage({
        action: 'cache-state',
        path,
        apiVersion,
        cacheData
      })
    } else {
      navigator.serviceWorker.controller.postMessage({ action: 'cache-path', path, apiVersion })
    }
  }
}

/**
 * Returns the cached response for the given URL if present.
 * @param {String} cacheName The name of the cache to pull from
 * @param {String} url A json fetch URL
 * @return {Promise<Response>}
 */
export async function getCachedResponse(cacheName, url) {
  const cachedResponse = await caches
    .open(`${cacheName}-${getAPIVersion()}`)
    .then(cache => cache.match(new Request(url)))

  return cachedResponse
}

if (typeof window !== 'undefined') {
  window._moovFromCache = getCachedResponse
}

/**
 * Prefetches and caches JSON for the specified path
 * @param {String} path A URL path for a page (without .json)
 */
export async function prefetchJsonFor(path, includeSSR) {
  if (!path) {
    return
  }
  if (path.startsWith('http')) {
    const url = new URL(path)
    cache(`${url.origin}${url.pathname}.json${url.search}`)
  } else {
    const url = new URL(`http://z.z${path}`)
    cache(`${url.pathname}.json${url.search}`)
  }
  if (includeSSR) {
    cache(path)
  }
}

/**
 * Prefetches and caches SSR and JSON for the specified path
 * @param {String} path A URL path for a page (without .json)
 */
export function prefetch(path) {
  cache(path)
  prefetchJsonFor(path)
}

/**
 * Aborts all in progress prefetches.  Call this function to prevent prefetching from blocking
 * more important requests, like page navigation.
 */
export async function abortPrefetches() {
  if (await waitForServiceWorkerController()) {
    navigator.serviceWorker.controller.postMessage({ action: 'abort-prefetches' })
  }
}

/**
 * Resume queued prefetch requests which were cancelled to allow for more important requests
 */
export async function resumePrefetches() {
  if (await waitForServiceWorkerController()) {
    navigator.serviceWorker.controller.postMessage({ action: 'resume-prefetches' })
  }
}

/**
 * Configures runtime caching options
 * @private
 * @param {Object} options
 * @param {Object} options.cacheName The name of the runtime cache
 * @param {Object} options.maxEntries The max number of entries to store in the cache
 * @param {Object} options.maxAgeSeconds The TTL in seconds for entries
 */
export async function configureCache(options) {
  if (await waitForServiceWorkerController()) {
    navigator.serviceWorker.controller.postMessage({ action: 'configure-runtime-caching', options })
  }
}

/**
 * Clears all API and SSR responses from the client cache
 * @return {Promise} Resolved once all caches have b
 */
export async function clearCache() {
  if ('caches' in window) {
    const keys = await caches.keys()

    for (let key of keys) {
      if (!key.startsWith('workbox-precache')) {
        await caches.delete(key)
      }
    }
  }
}

/**
 * Resolves when the service worker has been installed
 * @private
 */
export async function waitForServiceWorkerController() {
  if (!navigator.serviceWorker || !navigator.serviceWorker.ready) {
    return false
  }

  return new Promise(resolve => {
    navigator.serviceWorker.ready.then(() => {
      if (navigator.serviceWorker.controller) {
        return resolve(true)
      }
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        return resolve(true)
      })
    })
  })
}

/**
 * Removes runtime caches for old versions of the api.  This ensures that all responses
 * are appropriate for the current version of the UI.
 * @private
 */
export async function removeOldCaches() {
  if (await waitForServiceWorkerController()) {
    if (window.moov && window.moov.apiVersion) {
      navigator.serviceWorker.controller.postMessage({
        action: 'remove-old-caches',
        apiVersion: window.moov.apiVersion
      })
    }
  }
}

export default {
  removeOldCaches,
  waitForServiceWorkerController,
  configureCache,
  resumePrefetches,
  abortPrefetches,
  prefetch,
  prefetchJsonFor,
  cache
}
