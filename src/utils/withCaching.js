/**
 * Creates a cancelable event handler that will run unless the provided
 * handler calls `e.preventDefault()`.
 *
 * @param {Function} handler The original event handle supplied to the component
 * @param {Number} maxAgeSeconds The time in seconds that a result should be kept in the service worker cache.
 * @return {Function}
 */
export default function withCaching(handler, maxAgeSeconds) {
  return (req, res) => {
    if (maxAgeSeconds) {
      res.setHeader('x-sw-cache-control', `max-age: ${maxAgeSeconds}`)
    }

    return handler(req, res)
  }
}
