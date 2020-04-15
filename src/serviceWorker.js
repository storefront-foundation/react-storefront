import { prefetch } from 'workbox-prefetch/window'

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
  const parsed = new URL(url)
  return prefetch(`/api${parsed.pathname}${parsed.search}`)
}
