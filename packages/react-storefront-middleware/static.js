const { cache, FAR_FUTURE } = require('./cache')
const RESPONSE_TYPE = 'x-rsf-response-type'

module.exports = function handleStatic(res, path) {
  res.set(RESPONSE_TYPE, 'static')
  // It is important that the client never caches the service-worker so that it always goes to the network
  // to check for a new one.
  if (path.startsWith('/service-worker.js')) {
    // far future cache the service worker on the server
    cache(res, { browserMaxAge: 0, serverMaxAge: FAR_FUTURE })
  } else if (path.startsWith('/pwa')) {
    cache(res, { browserMaxAge: FAR_FUTURE, serverMaxAge: FAR_FUTURE })
  } else {
    cache(res, { serverMaxAge: FAR_FUTURE })
  }
}
