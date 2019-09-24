const http = require('http')
const https = require('https')

/**
 * Creates a new instance of the middlware
 * @return {Function} An express middleware function
 */
module.exports = function(server) {
  return (req, res) => {
    const exportedValues = {}

    req.pathname = req.path

    Object.assign(res, {
      relayUpstreamCookies: Function.prototype,
      cacheOnServer: Function.prototype
    })

    // shim get, which is provided on the moovweb platform
    req.headers.get = name => name && req.headers[name.toLowerCase()]

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

    server.serve(req, res)
  }
}
