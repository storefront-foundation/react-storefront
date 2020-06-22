/**
 * Returns `true` if the URL's hostname is the same as the origin that served the app, otherwise `false`.
 * @param {URL} url A URL instance
 * @return {Boolean}
 */
export default function isSameOrigin(url) {
  return url.hostname === window.location.hostname
}
