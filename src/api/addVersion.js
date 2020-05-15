/**
 * The query param that is added to fetch alls to /api routes to ensure that
 * cached results from previous versions of the app are not served to new versions
 * of the app.
 */
export const VERSION_PARAM = '__v__'

/**
 * Adds the next build id as the __v__ query parameter to the given url
 * @param {String} url Any URL
 * @return {URL}
 */
export default function addVersion(url) {
  /* istanbul ignore next */
  if (typeof window === 'undefined') return new URL(url, 'http://throwaway.api')

  const parsed = new URL(url, window.location.href)

  if (!parsed.searchParams.has(VERSION_PARAM) && typeof __NEXT_DATA__ !== 'undefined') {
    parsed.searchParams.append(VERSION_PARAM, __NEXT_DATA__.buildId)
  }

  return parsed
}
