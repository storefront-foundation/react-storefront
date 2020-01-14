/**
 * Creates a cancelable event handler that will run unless the provided
 * handler calls `e.preventDefault()`.
 *
 * @param {Function} handler The original event handle supplied to the component
 * @param {Function} defaultHandler A handler to run unless `e.preventDefault()` was called.
 * @return {Function}
 */
export default function withDefaultHandler(handler, defaultHandler) {
  return (e, ...args) => {
    if (handler) {
      handler(e, ...args)
    }

    if (!e.defaultPrevented) {
      defaultHandler(e, ...args)
    }
  }
}
