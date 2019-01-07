"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redirectTo = redirectTo;
exports.redirectToHttps = redirectToHttps;

var _cache = require("./cache");

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * Returns true if the request is a post from an amp page, otherwise false
 * @return {Boolean}
 */
function isAmpPost() {
  var _env = env,
      referer = _env.referer;
  return referer && referer.split('?')[0].endsWith('.amp') && env.method.toLowerCase() === 'post';
}
/**
 * Sends an http redirect.
 * @param {String} url The destination url.  Can be relative or absolute.
 * @param {Number} statusCode The status code to send.  Defaults to 301
 */


function redirectTo(url) {
  var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 301;
  var protocol = env.referer && env.referer.split(/:/)[0] || 'https';

  if (!url.match(/https?:\/\//)) {
    url = "".concat(protocol, "://").concat(env.host).concat(url);
  }

  if (isAmpPost()) {
    headers.addHeader("amp-redirect-to", url);
    headers.addHeader("access-control-expose-headers", "AMP-Access-Control-Allow-Source-Origin,AMP-Redirect-To");
    headers.addHeader("amp-access-control-allow-source-origin", "".concat(protocol, "://").concat(env.host));
  } else {
    headers.removeAllHeaders("Location");
    headers.addHeader("Location", url);
    headers.statusCode = statusCode;
  }

  (0, _cache.cache)({
    serverMaxAge: 0,
    browserMaxAge: 0
  });
}
/**
 * Redirects the browser to the same URL but on https.
 */


function redirectToHttps() {
  redirectTo("https://".concat(env.host).concat(env.path));
}
//# sourceMappingURL=redirect.js.map