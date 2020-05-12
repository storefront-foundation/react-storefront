import getAPIURL from './api/getAPIURL'
const prefetched = new Set()

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

/**
 * Prefetches the specified URL. This function will wait for the service worker
 * to be installed to ensure that it has the opportunity to cache the response.
 * @param {String} url The URL to prefetch
 */
export async function prefetch(url) {
  if (process.env.NODE_ENV !== 'production' && process.env.SERVICE_WORKER !== 'true') {
    return
  }

  if (prefetched.has(url)) {
    return
  }

  prefetched.add(url)
  await waitForServiceWorker()
  const link = document.createElement('link')
  const { relList } = link
  link.setAttribute('href', addPrefetchParam(url))

  link.setAttribute(
    'rel',
    relList.supports('preload') && /* istanbul ignore next */ !relList.supports('prefetch')
      ? /* istanbul ignore next */ 'preload'
      : 'prefetch', // Safari does not support prefetch so we use preload instead
  )

  document.head.append(link)
}

/**
 * Prefetches the JSON API results for a given page
 * @param {String} url The page URL.
 */
export function prefetchJsonFor(url) {
  return prefetch(getAPIURL(url))
}

/**
 * Adds process.env.PREFETCH_QUERY_PARAM to the URL so that back ends can identify prefetch requests and
 * potentially ignore them during periods of high traffic.
 * @param {String} url
 * @return {String} A new URL
 */
function addPrefetchParam(url) {
  const prefetchQueryParam = process.env.RSF_PREFETCH_QUERY_PARAM

  if (prefetchQueryParam) {
    const parsed = new URL(url, location.href)

    if (parsed.hostname === location.hostname) {
      // only add __prefetch__ for requests going back to the XDN.
      parsed.searchParams.append(prefetchQueryParam, '1')
    }

    return parsed.toString()
  } else {
    return url
  }
}

/**
 * Clears the set which keeps track of which URLs have been prefetched so
 * they can be prefetched again.
 */
export function resetPrefetches() {
  prefetched.clear()
}
