import addVersion from './addVersion'

/**
 * Returns the API URL for the given page
 * @param {String} pageURI The page URI
 * @return {String}
 */
export default function getAPIURL(pageURI) {
  const parsed = addVersion(pageURI)
  return `/api${parsed.pathname.replace(/\/$/, '')}${parsed.search}`
}
