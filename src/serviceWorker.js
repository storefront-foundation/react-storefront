import { prefetch } from '@xdn/prefetch/window'
import getAPIURL from './api/getAPIURL'

/**
 * Prefetch a URL using the service worker.
 * @param {String} url The URL to prefetch
 */
export { prefetch }

/**
 * Prefetches the JSON API results for a given page
 * @param {String} url The page URL.
 */
export function prefetchJsonFor(url) {
  return prefetch(getAPIURL(url))
}
