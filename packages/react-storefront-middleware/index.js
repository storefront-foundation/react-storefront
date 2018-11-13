const http = require('http')
const https = require('https')

/**
 * Creates a new instance of the middlware
 * @return {Function} An express middleware function
 */
module.exports = function(server) {
  return (req, res, next) => {
    Object.assign(global, env = {
      http,
      https,
      env: {
        asset_host: `//localhost:${process.env.PORT}`
      }
    })

    // console.log('req', req)
    server.serve(req, res)
  }
}