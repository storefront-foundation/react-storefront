const http = require('http')
const https = require('https')

/**
 * Creates a new instance of the middlware
 * @return {Function} An express middleware function
 */
module.exports = function(server) {
  return (req, res, next) => {
    const exportedValues = {}

    Object.assign(res, {
      relayUpstreamCookies: Function.prototype,
      cacheOnServer: Function.prototype
    })

    Object.assign(global, env = {
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

    console.log('exportedValues', exportedValues)

    // console.log('req', req) 
    server.serve(req, res)
  }
}