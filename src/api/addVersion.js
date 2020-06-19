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
  let appOrigin = 'http://throwaway.api'

  /* istanbul ignore else */
  if (typeof window !== 'undefined') {
    appOrigin = window.location.href
  }

  if (typeof url === 'string') {
    url = new URL(url, appOrigin)
  }

  /* istanbul ignore next */
  if (typeof window === 'undefined') return url

  if (!url.searchParams.has(VERSION_PARAM) && typeof __NEXT_DATA__ !== 'undefined') {
    url.searchParams.append(VERSION_PARAM, __NEXT_DATA__.buildId)
  }

  return url
}
