/**
 * The query param that is added to fetch alls to /api routes to ensure that
 * cached results from previous versions of the app are not served to new versions
 * of the app.
 */
export const VERSION_PARAM = '__v__'

/**
 * Adds the next build id as the __v__ query parameter to the given url if
 * the hostname is the same as the URL from which the app was served.
 * @param {URL|string} url Any URL
 * @return {URL}
 */
export default function addVersion(url) {
  const appOrigin = typeof window !== 'undefined' ? window.location.href : 'http://throwaway.api'

  if (typeof url === 'string') {
    url = new URL(url, appOrigin)
  }

  /* istanbul ignore next */
  if (typeof window === 'undefined') return url

  // we should only add ?__v__ for same-origin requests as this may break
  // requests to 3rd parties that have strict parameter validation such as firebase
  if (
    url.hostname === location.hostname &&
    !url.searchParams.has(VERSION_PARAM) &&
    typeof __NEXT_DATA__ !== 'undefined'
  ) {
    url.searchParams.append(VERSION_PARAM, __NEXT_DATA__.buildId)
  }

  return url
}
