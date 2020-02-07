const withOffline = require('next-offline')
const path = require('path')

module.exports = function withServiceWorker(config, bootstrapPath) {
  return withOffline({
    ...config,
    workboxOpts: {
      clientsClaim: true,
      skipWaiting: true,
      importScripts: [
        // Workbox v5 by default relies on module imports
        // Include workbox-sw to expose the `workbox` symbol globally within SW script
        'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js',
        path.join('_next', bootstrapPath),
      ],
      // The asset names for page chunks contain square brackets, eg [productId].js
      // Next internally injects these chunks encoded, eg %5BproductId%5D.js
      // For precaching to work the cache keys need to match the name of the assets
      // requested, therefore we need to tranform the manifest entries with encoding.
      manifestTransforms: [
        manifestEntries => {
          const manifest = manifestEntries.map(entry => {
            const newUrl = encodeURI(entry.url)
            entry.url = newUrl
            return entry
          })
          return { manifest, warnings: [] }
        },
      ],
    },
  })
}
