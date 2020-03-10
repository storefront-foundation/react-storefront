const withOffline = require('next-offline')
const path = require('path')

module.exports = function withServiceWorker(config) {
  const generateInDevMode = process.env.serviceWorker === 'true'
  if (generateInDevMode) {
    console.log('> Using service worker in development mode')
  }
  return withOffline({
    ...config,
    generateInDevMode,
    generateSw: false,
    workboxOpts: {
      swSrc: path.join(__dirname, '..', 'service-worker', 'service-worker.js'),
      swDest: 'static/service-worker.js',
      // The asset names for page chunks contain square brackets, eg [productId].js
      // Next internally injects these chunks encoded, eg %5BproductId%5D.js
      // For precaching to work the cache keys need to match the name of the assets
      // requested, therefore we need to transform the manifest entries with encoding.
      manifestTransforms: [
        manifestEntries => {
          const manifest = manifestEntries.map(entry => {
            entry.url = encodeURI(entry.url)
            return entry
          })
          return { manifest, warnings: [] }
        },
      ],
    },
  })
}
