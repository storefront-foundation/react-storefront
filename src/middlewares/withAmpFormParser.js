import formidable from 'formidable'

/**
 * Wraps the provided handler in a middleware that parses AMP form submissions correctly.  By
 * default, next.js's body parser doesn't handle multipart form posts properly, so you
 * won't be able to receive data posted from a form in AMP.
 *
 * When using this middleware, you should always disable next's default body parser by adding
 * the following to your api endpoint:
 *
 * ```js
 * export const config = {
 *   api: {
 *     bodyParser: false
 *   }
 * }
 * ```
 *
 * @param {Function} handler An API endpoint
 * @return {Function} Your API function with body parsing middleware added.
 */
export default function withAmpFormParser(handler) {
  return (req, res) => {
    const form = formidable()

    if (req.method.toLowerCase() === 'post') {
      try {
        form.parse(req, (err, fields) => {
          if (err) {
            res.status(500).end(err.message)
          } else {
            req.body = fields
            return handler(req, res)
          }
        })
      } catch (err) {
        /* istanbul ignore next */
        res.status(500).end(err.message)
      }
    } else {
      return handler(req, res)
    }
  }
}
