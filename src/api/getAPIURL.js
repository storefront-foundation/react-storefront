/**
 * Returns the API URL for the given page
 * @param {String} pageURI The page URI
 * @return {String}
 */
export default function getAPIURL(pageURI) {
  pageURI = `/api${pageURI.replace(/\/$/, '')}`

  if (typeof __NEXT_DATA__ !== 'undefined') {
    pageURI += (pageURI.indexOf('?') === -1 ? '?' : '&') + `__v__=${__NEXT_DATA__.buildId}`
  }

  return pageURI
}
