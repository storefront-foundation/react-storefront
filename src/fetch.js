import unfetch from 'isomorphic-unfetch'

export const RSF_VERSION_HEADER = 'x-sw-version'
export const RSF_API_VERSION = process.env.WORKBOX_PREFETCH_VERSION || '1'

/**
 * An isomorphic implementation of the fetch API that always sends the x-rsf-api-version header.  You should
 * always use this to fetch data on both the client and server to ensure that React Storefront's
 * service worker serves responses cached by the service worker.
 *
 * @param {String} url URL to `fetch`.
 * @param {Object} opts Options passed to the `fetch` call.
 * @return {Promise} The `Promise` returned from the `fetch` call.
 */
export default function fetch(url, opts = {}) {
  const headers = opts.headers || {}
  headers[RSF_VERSION_HEADER] = RSF_API_VERSION
  return unfetch(url, { ...opts, headers })
}

/**
 * @private
 * Adds x-rsf-api-version to all xhr
 */
function monkeyPatchXHR() {
  const open = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function() {
    const res = open.apply(this, arguments)
    this.setRequestHeader(RSF_VERSION_HEADER, RSF_API_VERSION)
    return res
  }
}

/**
 * @private
 * Adds x-rsf-api-version to all fetch requests
 */
function monkeyPatchFetch() {
  // We don't add fetch if it's not there, so browsers will not try to detect it
  if (window.fetch) {
    window.fetch = fetch
  }
}

if (typeof window !== 'undefined') {
  monkeyPatchXHR()
  monkeyPatchFetch()
}
