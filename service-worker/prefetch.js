import { getAPICacheName, addToCache } from './cache'

/**
 * The http response status that indicates that a prefetch request could
 * not be fulfilled from the edge cache.
 */
export const PREFETCH_CACHE_MISS = 412

// controllers that allow us to abort in-flight prefetch requests
const abortControllers = new Set()

// prefetch requests to resume after the current non-prefetch request is finished
const toResume = new Set()

/**
 * Abort and queue all in progress prefetch requests for later. You can call this method to ensure
 * that prefetch requests do not block more important requests, like page navigation.
 */
export function abortPrefetches() {
  for (let controller of abortControllers) {
    toResume.add(controller.args)
    controller.abort()
  }
  abortControllers.clear()
}

/**
 * Resume queued prefetch requests which were cancelled to allow for more important requests
 */
export function resumePrefetches() {
  if (toResume.size === 0) return
  console.log('[service worker] resuming prefetches')
  for (let args of toResume) {
    prefetch(...args)
  }
  toResume.clear()
}

/**
 * Fetches and caches all links with data-rsf-prefetch="prefetch"
 * @param {Object} response
 */
export function prefetchLinks(response) {
  return response.text().then(html => {
    const matches = html.match(/href="([^"]+)"\sdata-rsf-prefetch/g)
    if (matches) {
      return Promise.all(
        matches.map(match => match.match(/href="([^"]+)"/)[1]).map(path => prefetch({ path })),
      )
    }
    return Promise.resolve()
  })
}

/**
 * Fetches and caches the specified path.
 * @param {Object} options Cache path options
 * @param {String} options.path A URL path
 * @param {String} options.apiVersion The version of the api that the client is running
 * @param {Boolean} cacheLinks Set to true to fetch and cache all links in the HTML returned
 */
export function prefetch({ path, apiVersion } = {}, cacheLinks) {
  const cacheName = getAPICacheName(apiVersion)

  return caches.open(cacheName).then(cache => {
    cache.match(path).then(match => {
      if (!match) {
        console.log('[service worker]', 'prefetching', path)

        // Create an abort controller so we can abort the prefetch if a more important
        // request is sent.
        const abort = new AbortController()

        // Save prefetching arguments if we need to resume a cancelled request
        abort.args = [{ path, apiVersion }, cacheLinks]
        abortControllers.add(abort)

        const headers = {
          'x-rsf-prefetch': '1',
        }

        // We connect the fetch with the abort controller here with the signal
        fetch(path, {
          credentials: 'include',
          signal: abort.signal,
          headers,
        })
          .then(response => {
            return (cacheLinks ? prefetchLinks(response.clone()) : Promise.resolve()).then(() => {
              if (response.status === 200) {
                response.text().then(data => {
                  addToCache(cache, path, data, response.headers.get('content-type'))
                  console.log(`[service worker] ${path} was prefetched and added to ${cacheName}`)
                })
              } else if (response.status === PREFETCH_CACHE_MISS) {
                console.log(`[service worker] ${path} was throttled.`)
              } else {
                console.log(
                  `[service worker] ${path} was not prefetched, returned status ${response.status}.`,
                )
              }
            })
          })
          .then(() => abortControllers.delete(abort))
          .catch(error => {
            console.log('[service worker] aborted prefetch for', path)
          })
      }
    })
  })
}
