const withOffline = require('next-offline')
const { join } = require('path')

module.exports = function withServiceWorker(config) {
  const generateInDevMode = process.env.SERVICE_WORKER === 'true'

  if (generateInDevMode) {
    console.log('> Using service worker in development mode')
  }

  return withOffline({
    ...config,
    generateInDevMode,
    generateSw: false,
    workboxOpts: {
      swDest: 'static/service-worker.js',
      swSrc: join(process.cwd(), 'sw', 'service-worker.js'),
      // The asset names for page chunks contain square brackets, eg [productId].js
      // Next internally injects these chunks encoded, eg %5BproductId%5D.js
      // For precaching to work the cache keys need to match the name of the assets
      // requested, therefore we need to transform the manifest entries with encoding.
      manifestTransforms: [
        manifestEntries => {
          console.log('> Creating service worker...')
          const manifest = manifestEntries
            .filter(entry => !entry.url.includes('next/dist')) // these paths fail in development resulting in the service worker not being installed
            .map(entry => {
              entry.url = encodeURI(entry.url)
              return entry
            })
          return { manifest, warnings: [] }
        },
      ],
    },
  })
}
