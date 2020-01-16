const withOffline = require('next-offline')
const path = require('path')

module.exports = function withServiceWorker(config, bootstrapPath) {
  return withOffline({
    ...config,
    workboxOpts: {
      clientsClaim: true,
      skipWaiting: true,
      importScripts: [path.join('_next', bootstrapPath)],
    },
  })
}
