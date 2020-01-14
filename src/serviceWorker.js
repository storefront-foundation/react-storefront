/**
 * Prefetch a URL using the service worker.
 * @param {String} url The URL to prefetch
 */
export async function prefetch(url) {
  if (await waitForServiceWorker()) {
    navigator.serviceWorker.controller.postMessage({
      action: 'cache-path',
      path: url,
      apiVersion: process.env.RSF_API_VERSION || '1',
    })
  }
}

/**
 * Prefetches the JSON API results for a given page
 * @param {String} url The page URL.
 */
export function prefetchJsonFor(url) {
  const parsed = new URL(url)
  return prefetch(`/api/${parsed.path}${parsed.search}`)
}

/**
 * Resolves when the service worker has been installed.
 * @private
 */
export function waitForServiceWorker() {
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
