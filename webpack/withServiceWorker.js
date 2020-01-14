const withOffline = require('next-offline')

module.exports = function withServiceWorker(config, bootstrapPath) {
  return withOffline({
    ...config,
    workboxOpts: {
      clientsClaim: true,
      skipWaiting: true,
      importScripts: [bootstrapPath],
    },
  })
}
