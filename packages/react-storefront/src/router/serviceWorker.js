/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Cache content using the service worker.  If content is not supplied, the service worker will fetch
 * the content from the server
 * @param {String} path The URI path of the request
 * @param {String} cacheData The data to cache
 */
export async function cache(path, cacheData) {
  if (await waitForServiceWorkerController()) {
    const { apiVersion } = window.moov

    if (cacheData) {
      navigator.serviceWorker.controller.postMessage({
        action: 'cache-state',
        path,
        apiVersion,
        cacheData,
      })
    } else {
      navigator.serviceWorker.controller.postMessage({ action: 'cache-path', path, apiVersion })
    }
  }
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
 * Resolves when the service worker has been installed
 */
async function waitForServiceWorkerController() {
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
 */
export async function removeOldCaches() {
  if (await waitForServiceWorkerController()) {
    navigator.serviceWorker.controller.postMessage({
      action: 'remove-old-caches',
      apiVersion: window.moov.apiVersion,
    })
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
  cache,
}
