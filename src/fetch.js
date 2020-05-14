import addVersion from './api/addVersion'

// Here we patch fetch and XMLHttpRequest to always add version parameter to api calls so that cached results
// from previous versions of the app aren't served to new versions.
/* istanbul ignore else */
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch

  window.fetch = function rsfVersionedFetch(url, init) {
    return originalFetch(addVersion(url).toString(), init)
  }
}

/* istanbul ignore else */
if (typeof XMLHttpRequest !== 'undefined') {
  const originalOpen = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function rsfVersionedOpen(method, url, ...others) {
    return originalOpen.call(this, method, addVersion(url).toString(), ...others)
  }
}

/**
 * An isomorphic implementation of the fetch API. You should always use this to fetch data on both the client and server.
 * When making requests to /api routes, ?__v__={next_build_id} will always be added to ensure that cached results
 * from previous versions of the app aren't served to new versions.
 */
export default require('isomorphic-unfetch')
