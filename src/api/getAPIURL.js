/**
 * Returns the API URL for the given page
 * @param {String} pageURI The page URI
 * @return {String}
 */
export default function getAPIURL(pageURI) {
  return `/api/${process.env.RSF_APP_VERSION}${pageURI.replace(/\/$/, '')}`
}
