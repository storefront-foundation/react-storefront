/**
 * Returns the API URL for the given page
 * @param {String} pageURI The page URI
 * @return {String}
 */
export default function getAPIURL(pageURI) {
  const parsed = new URL(pageURI, 'http://throwaway.com')

  if (typeof __NEXT_DATA__ !== 'undefined') {
    parsed.searchParams.append('__v__', __NEXT_DATA__.buildId)
  }

  return '/api' + parsed.pathname.replace(/\/$/, '') + parsed.search
}
