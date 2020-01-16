const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

function copyBootstrap({
  prefetchRampUpTime,
  allowPrefetchThrottling = false,
  serveSSRFromCache = false,
} = {}) {
  let deployTime = new Date().getTime()

  if (allowPrefetchThrottling) {
    // pre fetch ramp up is not needed if we're allowing prefetch throttling
    prefetchRampUpTime = 0
  } else {
    deployTime += 5 * 1000 * 60 // add 5 minutes to give the build time to deploy
  }

  const swBootstrap = path.join(__dirname, 'bootstrap.js')

  const swBootstrapCode = fs
    .readFileSync(swBootstrap, 'utf8')
    .replace('{{version}}', deployTime)
    .replace('{{deployTime}}', deployTime)
    .replace('{{prefetchRampUpTime}}', prefetchRampUpTime)
    .replace('{{allowPrefetchThrottling}}', allowPrefetchThrottling)
    .replace('{{serveSSRFromCache}}', serveSSRFromCache)

  const swHash = crypto
    .createHash('md5')
    .update(swBootstrapCode)
    .digest('hex')

  const swBootstrapOutputFile = `static/serviceWorkerBootstrap.${swHash}.js`

  return {
    bootstrapPath: swBootstrapOutputFile,
    makeCopyOptions: root => ({
      from: swBootstrap,
      to: path.join(root, swBootstrapOutputFile),
      transform: () => swBootstrapCode,
    }),
  }
}

module.exports = copyBootstrap
