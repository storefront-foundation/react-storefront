/**
 * Gets the name of the versioned runtime cache
 * @param {String} apiVersion The api version
 * @return {String} A cache name
 */
export function getAPICacheName(apiVersion) {
  return `runtime-${apiVersion}`
}

/**
 * Adds a result to the cache
 * @param {Cache} cache
 * @param {String} path The URL path
 * @param {String} data The response body
 * @param {String} contentType The MIME type
 */
export function addToCache(cache, path, data, contentType) {
  const blob = new Blob([data], { type: contentType })

  const res = new Response(blob, {
    status: 200,
    headers: {
      'Content-Length': blob.size,
      date: new Date().toString(),
    },
  })

  return cache.put(path, res)
}

/**
 * Adds the specified data to the cache
 * @param {Object} options Cache state options
 * @param {String} options.path A URL path
 * @param {Object|String} options.cacheData The data to cache. Objects will be converted to JSON.
 * @param {String} options.apiVersion The version of the api that the client is running.
 */
export function cacheState({ path, cacheData, apiVersion } = {}) {
  const cacheName = getAPICacheName(apiVersion)

  return caches.open(cacheName).then(cache => {
    let type = 'text/html'

    if (typeof cacheData === 'object') {
      type = 'application/json'
      cacheData = JSON.stringify(cacheData, null, 2)
    }

    addToCache(cache, path, cacheData, type)
    console.log('[service worker]', `caching ${path}`)
  })
}
