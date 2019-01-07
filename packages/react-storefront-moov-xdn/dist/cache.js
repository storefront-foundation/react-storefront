"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = cache;
exports.cacheProxiedAssets = cacheProxiedAssets;
exports.ONE_DAY = exports.FAR_FUTURE = void 0;

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * Sets the correct response headers to configure browser and server caching
 * @param {Object} options
 * @param {Number} options.serverMaxAge The TTL for the edge caches.  Set to 0 to send a no-cache.  Omit to send no value for the client.
 * @param {Number} options.browserMaxAge The TTL for the browser's cache
 */
function cache(_ref) {
  var serverMaxAge = _ref.serverMaxAge,
      browserMaxAge = _ref.browserMaxAge;
  var cacheControl = [];

  if (browserMaxAge === 0) {
    cacheControl.push("no-cache");
  } else if (browserMaxAge != null) {
    cacheControl.push("maxage=".concat(browserMaxAge));
  }

  if (serverMaxAge) {
    // remove these headers so varnish caching works correctly
    headers.removeAllHeaders("Age");
    headers.removeAllHeaders("Via");
    headers.removeAllHeaders("Expires");
    headers.header('X-Moov-Cache', 'true');
    cacheControl.push("s-maxage=".concat(serverMaxAge));
  }

  if (cacheControl.length) {
    headers.header('Cache-Control', cacheControl.join(', '));
  }
}
/**
 * Sets a cache time of one day for all image and font assets which are proxied from upstream.
 * @param {String} pathname 
 */


function cacheProxiedAssets(pathname, _ref2) {
  var serverMaxAge = _ref2.serverMaxAge;

  if (pathname.match(/(jpeg|jpg|png|gif|svg|woff2?|ttf|otf)$/)) {
    cache({
      serverMaxAge: serverMaxAge
    });
  }
}
/**
 * The TTL for far-future cached assets
 */


var FAR_FUTURE = 290304000;
/**
 * The number of seconds in a day
 */

exports.FAR_FUTURE = FAR_FUTURE;
var ONE_DAY = 86400;
exports.ONE_DAY = ONE_DAY;
//# sourceMappingURL=cache.js.map