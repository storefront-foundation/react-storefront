console.log('[react-storefront service worker]', 'Using React Storefront Service Worker')

workbox.loadModule('workbox-strategies')

const PREFETCH_CACHE_MISS = 412

// If we used anything other than a 2xx status, chrome console will show a
// failed fetch every time there is a cache miss.  If we return null, workbox
// will show a warning and chrome console will show a fetch failure.
const CLIENT_CACHE_MISS = 204

let runtimeCacheOptions = {}
let abortControllers = new Set()
let toResume = new Set()
let deployTime, prefetchFullRampUpTime

const appShellPath = '/.app-shell'

try {
  // injected via webpack client build
  deployTime = parseInt('{{deployTime}}')
  prefetchFullRampUpTime = parseInt('{{prefetchRampUpTime}}')
} catch {
  deployTime = 0
  prefetchFullRampUpTime = 1
}

/**
 * Configures parameters for cached routes.
 * @param {Object} options
 * @param {Object} options.cacheName The name of the runtime cache
 * @param {Object} options.maxEntries The max number of entries to store in the cache
 * @param {Object} options.maxAgeSeconds The TTL in seconds for entries
 */
function configureRuntimeCaching({ maxEntries = 200, maxAgeSeconds = 60 * 60 * 24 } = {}) {
  console.log(
    `[react-storefront service worker] configureRuntimeCaching, maxEntries: ${maxEntries}, maxAgeSeconds: ${maxAgeSeconds}`,
  )

  runtimeCacheOptions = {
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries,
        maxAgeSeconds,
      }),
    ],
  }
}

configureRuntimeCaching()

/**
 * Fetches and caches all links with data-rsf-prefetch="prefetch"
 * @param {Object} response
 */
function precacheLinks(response) {
  return response.text().then(html => {
    const matches = html.match(/href="([^"]+)"\sdata-rsf-prefetch/g)
    if (matches) {
      return Promise.all(
        matches.map(match => match.match(/href="([^"]+)"/)[1]).map(path => cachePath({ path })),
      )
    }
    return Promise.resolve()
  })
}

/**
 * Fetches and caches the specified path.
 * @param {Object} options A URL path
 * @param {String} options.path A URL path
 * @param {String} options.apiVersion The version of the api that the client is running
 * @param {Boolean} cacheLinks Set to true to fetch and cache all links in the HTML returned
 */
function cachePath({ path, apiVersion } = {}, cacheLinks) {
  const cacheName = getAPICacheName(apiVersion)

  return caches.open(cacheName).then(cache => {
    cache.match(path).then(match => {
      if (!match) {
        console.log('[react-storefront service worker]', 'prefetching', path)

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
            return (cacheLinks ? precacheLinks(response.clone()) : Promise.resolve()).then(() => {
              if (response.status === 200) {
                response.text().then(data => {
                  addToCache(cache, path, data, response.headers.get('content-type'))
                  console.log(
                    `[react-storefront service worker] ${path} was prefetched and added to ${cacheName}`,
                  )
                })
              } else if (response.status === PREFETCH_CACHE_MISS) {
                console.log(`[react-storefront service worker] ${path} was throttled.`)
              } else {
                console.log(
                  `[react-storefront service worker] ${path} was not prefetched, returned status ${response.status}.`,
                )
              }
            })
          })
          .then(() => abortControllers.delete(abort))
          .catch(error => {
            console.log('[react-storefront service worker] aborted prefetch for', path)
          })
      }
    })
  })
}

/**
 * Abort and queue all in progress prefetch requests for later. You can call this method to ensure
 * that prefetch requests do not block more important requests, like page navigation.
 */
function abortPrefetches() {
  for (let controller of abortControllers) {
    toResume.add(controller.args)
    controller.abort()
  }
  abortControllers.clear()
}

/** Resume queued prefetch requests which were cancelled to allow for more important requests */
function resumePrefetches() {
  console.log('[react-storefront service worker] resuming prefetches')
  for (let args of toResume) {
    cachePath(...args)
  }
  toResume.clear()
}

/**
 * Adds a result to the cache
 * @param {Cache} cache
 * @param {String} path The URL path
 * @param {String} data The response body
 * @param {String} contentType The MIME type
 */
function addToCache(cache, path, data, contentType) {
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
 * @param {Object} options A URL path
 * @param {String} options.path A URL path
 * @param {Boolean} options.cacheData The data to cache
 * @param {String} options.apiVersion The version of the api that the client is running.
 */
function cacheState({ path, cacheData, apiVersion } = {}) {
  const cacheName = getAPICacheName(apiVersion)

  return caches.open(cacheName).then(cache => {
    let type = 'text/html'

    if (typeof cacheData === 'object') {
      type = 'application/json'
      cacheData = JSON.stringify(cacheData, null, 2)
    }

    addToCache(cache, path, cacheData, type)
    console.log('[react-storefront service worker]', `caching ${path}`)
  })
}

// provide the message interface that allows the PWA to prefetch
// and cache resources.
self.addEventListener('message', function(event) {
  if (event.data && event.data.action) {
    const { action } = event.data

    if (action === 'cache-path') {
      cachePath(event.data)
    } else if (action === 'cache-state') {
      cacheState(event.data)
    } else if (action === 'configure-runtime-caching') {
      configureRuntimeCaching(event.data.options)
    } else if (action === 'abort-prefetches') {
      abortPrefetches()
    } else if (action === 'resume-prefetches') {
      resumePrefetches()
    }
  }
})

const isApiRequest = path => path.match(/^\/api\//)

/**
 * Gets the name of the versioned runtime cache
 * @param {String} apiVersion The api version
 * @return {String} A cache name
 */
function getAPICacheName(apiVersion) {
  return `runtime-${apiVersion}`
}

self.addEventListener('install', event => {
  // Deletes all runtime caches except the one for the current api version
  // We do this since we create a new versioned cache name every time we release
  // a new version of the app.  So if we didn't delete the old ones, we would just keep
  // using up local storage
  caches.keys().then(keys => {
    for (let key of keys) {
      if (!key.startsWith('workbox-precache')) caches.delete(key)
    }
  })

  // Cache non-amp version of pages when users land on AMP page
  clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(allClients => {
      allClients
        .map(client => {
          const url = new URL(client.url)
          return url.pathname + url.search
        })
        .filter(path => path.match(/\.amp$/))
        .map(path => path.replace('.amp', ''))
        .forEach(path => cachePath({ path }, true))
    })
})

/**
 * Returns true if the URL uses https
 * @param {Object} context
 * @return {Boolean}
 */
function isSecure(context) {
  return context.url.protocol === 'https:' || context.url.hostname === 'localhost'
}

/**
 * Returns true if the URL is for a static asset like a js chunk
 * @param {Object} context
 * @return {Boolean}
 */
function isStaticAsset(context) {
  return context.url.pathname.startsWith('/_next/static/')
}

/**
 * Returns true if the URL is for an amp page
 * @param {URL} url
 * @return {Boolean}
 */
function isAmp(url) {
  return !!url.pathname.match(/\.amp$/)
}

/**
 * Only deliver HTML from the cache when transitioning from AMP or launching from the homescreen.
 * @param {String} url The url being fetched
 * @param {Event} event The fetch event
 * @return {Boolean}
 */
function shouldServeHTMLFromCache(url, event) {
  return (
    '{{serveSSRFromCache}}' === 'true' ||
    isAmp({ pathname: event.request.referrer }) ||
    /\?source=pwa/.test(url.search) ||
    /(\?|&)powerlink/.test(url.search)
  )
}

/**
 * Returns true of the request is for a video file
 * @param {Object} context
 * @return {Boolean}
 */
function isVideo(context) {
  return context.url.pathname.match(/\.mp4$/)
}

const matchRuntimePath = context => {
  return (
    isSecure(context) /* non secure requests will fail */ &&
    !isStaticAsset(context) /* let precache routes handle those */ &&
    !isVideo(context)
  ) /* Safari has a known issue with service workers and videos: https://adactio.com/journal/14452 */
}

function offlineResponse(apiVersion, context) {
  if (isApiRequest(context.url.pathname)) {
    const offlineData = { page: 'Offline' }
    const blob = new Blob([JSON.stringify(offlineData, null, 2)], {
      type: 'application/json',
    })
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Length': blob.size,
      },
    })
  } else {
    // If not API request, find and send app shell
    const cacheName = getAPICacheName(apiVersion)
    const req = new Request(appShellPath)
    return caches.open(cacheName).then(cache => cache.match(req))
  }
}

workbox.routing.registerRoute(matchRuntimePath, async context => {
  try {
    const { url, event } = context

    if (isAmp(url)) {
      cachePath({ path: url.pathname + url.search }, true)
    }

    const headers = event.request.headers
    const apiVersion = headers.get('x-rsf-api-version')
    const cacheName = getAPICacheName(apiVersion)
    const cacheOptions = { ...runtimeCacheOptions, cacheName }

    // Check the cache for all routes. If the result is not found, get it from the network.
    return new workbox.strategies.CacheOnly(cacheOptions)
      .handle(context)
      .catch(() =>
        new workbox.strategies.NetworkOnly().handle(context).then(apiRes => {
          // 1. withReactStorefront should create a api_version value, which can just be the timestamp of the build
          // 2. it provide that to client and server build as a webpack define
          // 3. we should monkey-patch xhr to send x-rsf-api-version as a request header on all requests

          if (apiRes.headers.get('x-rsf-cache-control') && apiVersion) {
            const path = url.pathname

            caches.open(cacheName).then(cache => {
              cache.put(path, apiRes)
              console.log('[react-storefront service worker]', `caching ${path}`)
            })
          }

          return apiRes.clone()
        }),
      )
      .catch(() => offlineResponse(apiVersion, context))
  } catch (e) {
    // if anything goes wrong, fallback to network
    // this is critical - if there is a bug in the service worker code, the whole site can stop working
    console.warn('[react-storefront service worker]', 'caught error in service worker', e)
    return new workbox.strategies.NetworkOnly().handle(context)
  }
})
