/**
 * Creates a cancelable event handler that will run unless the provided
 * handler calls `e.preventDefault()`.
 *
 * @param {Function} handler The original event handle supplied to the component
 * @param {Function} defaultHandler A handler to run unless `e.preventDefault()` was called.
 * @return {Function}
 */
export default function withCaching(handler, { browser, edge }) {
  return (req, res) => {
    if (browser.maxAgeSeconds) {
      res.setHeader('x-rsf-cache-control', `max-age: ${browser.maxAgeSeconds}`)
    }

    return handler(req, res)
  }
}
