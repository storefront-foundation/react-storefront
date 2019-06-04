/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * Sets the correct response headers to configure browser and server caching
 * @param {Response} Express Response
 * @param {Object} options
 * @param {Number} options.serverMaxAge The TTL for the edge caches.  Set to 0 to send a no-cache.  Omit to send no value for the client.
 * @param {Number} options.browserMaxAge The TTL for the browser's cache
 */
function cache(res, { serverMaxAge, browserMaxAge }) {
  const cacheControl = []

  if (browserMaxAge === 0) {
    cacheControl.push('private, no-store, no-cache')
  } else if (browserMaxAge != null) {
    cacheControl.push(`maxage=${browserMaxAge}`)
  }

  if (serverMaxAge) {
    // remove these headers so varnish caching works correctly
    res.removeHeader('Age')
    res.removeHeader('Via')
    res.removeHeader('Expires')
    res.set('X-Moov-Cache', 'true')
    cacheControl.push(`s-maxage=${serverMaxAge}`)
  }

  if (cacheControl.length) {
    res.set('Cache-Control', cacheControl.join(', '))
  }
}

/**
 * Sets a cache time of one day for all image and font assets which are proxied from upstream.
 * @param {Response} res Express Response
 * @param {String} pathname
 */
function cacheProxiedAssets(res, pathname, { serverMaxAge }) {
  if (pathname.match(/(jpeg|jpg|png|gif|svg|woff2?|ttf|otf)$/)) {
    cache(res, { serverMaxAge })
  }
}

/**
 * The TTL for far-future cached assets
 */
const FAR_FUTURE = 290304000

/**
 * The number of seconds in a day
 */
const ONE_DAY = 86400

module.exports = {
  cache,
  cacheProxiedAssets,
  FAR_FUTURE,
  ONE_DAY
}
