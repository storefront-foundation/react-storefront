import getAPIURL from './api/getAPIURL'
import { waitForServiceWorker } from './serviceWorker'

const prefetchQueryParam =
  typeof RSF_PREFETCH_QUERY_PARAM !== 'undefined' ? RSF_PREFETCH_QUERY_PARAM : undefined

const prefetched = new Set()

/**
 * Prefetches the specified URL. This function will wait for the service worker
 * to be installed to ensure that it has the opportunity to cache the response.
 * @param {String} url The URL to prefetch
 */
export async function prefetch(url) {
  if (prefetched.has(url)) {
    return
  }

  prefetched.add(url)
  await waitForServiceWorker()
  const link = document.createElement('link')
  const { relList } = link
  const parsed = new URL(url, location.href)

  if (parsed.hostname === location.hostname) {
    // only add __prefetch__ for requests going back to the XDN.
    link.setAttribute('href', addPrefetchParam(url))
  }

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
  if (prefetchQueryParam) {
    const parsed = new URL(url, location.href)
    parsed.searchParams.append(prefetchQueryParam, '1')
    return parsed.toString()
  } else {
    return url
  }
}
