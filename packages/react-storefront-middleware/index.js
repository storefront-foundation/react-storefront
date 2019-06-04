const http = require('http')
const https = require('https')
const responseHeaderTransform = require('./responseHeaderTransform')

/**
 * Creates a new instance of the middleware
 * @return {Function} An express middleware function
 */
module.exports = function(server, publicPath) {
  return (req, res) => {
    const exportedValues = {}

    req.pathname = req.path

    Object.assign(res, {
      relayUpstreamCookies: Function.prototype,
      cacheOnServer: Function.prototype
    })

    Object.assign(
      global,
      (env = {
        http,
        https,
        fns: {
          export: (key, value) => {
            exportedValues[key] = value
          }
        },
        env: {
          asset_host: `//localhost:${(process.env.PORT || 8500) + 1}`
        }
      })
    )

    // app.use(express.static('public'))

    responseHeaderTransform(req, res)

    server.serve(req, res)
  }
}
