import getAPIURL from './api/getAPIURL'
import { waitForServiceWorker } from './serviceWorker'

const PREFETCH_QUERY_PARAM = '__prefetch__'
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
 * Adds __prefetch__=1 to the URL so that back ends can identify prefetch requests and
 * potentially ignore them during periods of high traffic.
 * @param {String} url
 * @return {String} A new URL
 */
function addPrefetchParam(url) {
  const parsed = new URL(url, location.href)
  parsed.searchParams.append(PREFETCH_QUERY_PARAM, '1')
  return parsed.toString()
}
