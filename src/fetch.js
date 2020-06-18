import addVersion from './api/addVersion'
import isSameOrigin from './utils/isSameOrigin'

/**
 * Returns the parsed URL for the specified request
 * @param {Request|String} request A request instance or a URL string
 * @return {URL}
 */
function getURL(request) {
  let url = request.url

  if (typeof request === 'string') {
    url = request
  }

  return new URL(url, window.location.href)
}

// Here we patch fetch and XMLHttpRequest to always add version parameter to api calls so that cached results
// from previous versions of the app aren't served to new versions.
/* istanbul ignore else */
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch

  window.fetch = function rsfVersionedFetch(url, init, ...others) {
    const parsed = getURL(url)

    if (!isSameOrigin(parsed)) {
      return originalFetch(url, init)
    }

    if (typeof url === 'string') {
      url = addVersion(parsed).toString()
    } else {
      // the first param can be a request object
      url = new Request(addVersion(parsed).toString(), url)
    }

    return originalFetch(url, init)
  }
}

/* istanbul ignore else */
if (typeof XMLHttpRequest !== 'undefined') {
  const originalOpen = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function rsfVersionedOpen(method, url, ...others) {
    const parsed = getURL(url)

    if (isSameOrigin(parsed)) {
      return originalOpen.call(this, method, addVersion(parsed).toString(), ...others)
    } else {
      return originalOpen.call(this, method, url, ...others)
    }
  }
}

/**
 * An isomorphic implementation of the fetch API. You should always use this to fetch data on both the client and server.
 * When making requests to /api routes, ?__v__={next_build_id} will always be added to ensure that cached results
 * from previous versions of the app aren't served to new versions.
 */
export default require('isomorphic-unfetch')
