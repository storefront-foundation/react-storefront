"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = responseHeaderTransform;

var _cache = require("./cache");

var _redirect = require("./redirect");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * Run this in moov_response_header_transform.js
 */
function responseHeaderTransform() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$cacheProxiedAsse = _ref.cacheProxiedAssets,
      cacheProxiedAssets = _ref$cacheProxiedAsse === void 0 ? {
    serverMaxAge: _cache.ONE_DAY
  } : _ref$cacheProxiedAsse;

  if (env.__static_origin_path__) {
    headers.header('x-rsf-response-type', 'static'); // It is important that the client never caches the servce-worker so that it always goes to the network
    // to check for a new one.

    if (env.path.startsWith('/service-worker.js')) {
      // far future cache the service worker on the server
      (0, _cache.cache)({
        browserMaxAge: 0,
        serverMaxAge: _cache.FAR_FUTURE
      });
    } else if (env.path.startsWith('/pwa')) {
      (0, _cache.cache)({
        browserMaxAge: _cache.FAR_FUTURE,
        serverMaxAge: _cache.FAR_FUTURE
      });
    } else {
      (0, _cache.cache)({
        serverMaxAge: _cache.FAR_FUTURE
      });
    }
  } else {
    var _env$path$split = env.path.split(/\?/),
        _env$path$split2 = _slicedToArray(_env$path$split, 1),
        pathname = _env$path$split2[0];

    (0, _cache.cacheProxiedAssets)(pathname, cacheProxiedAssets); // Always redirect on non-secure requests.

    if (env.secure !== 'true') {
      return (0, _redirect.redirectToHttps)();
    }

    addSecureHeaders(); // This gives us a mechanism to set cookies on adapt pages

    if (env.SET_COOKIE) {
      headers.addHeader("set-cookie", env.SET_COOKIE);
    }

    headers.addHeader('x-moov-api-version', __webpack_hash__); // set headers and status from Response object

    var response = env.MOOV_PWA_RESPONSE;

    if (response) {
      headers.statusCode = response.statusCode;

      if (response.statusText) {
        headers.statusText = response.statusText;
      } // set by cache route handlers


      if (response.cache) {
        (0, _cache.cache)(response.cache);
      } // send headers


      for (var name in response.headers) {
        headers.addHeader(name, response.headers[name]);
      } // set cookies


      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = response.cookies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var cookie = _step.value;
          headers.addHeader('set-cookie', cookie);
        } // handle redirects

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (response.redirectTo) {
        (0, _redirect.redirectTo)(response.redirectTo, headers.statusCode);
      }
    }
  } // never cache responses with an error status or temporary redirect


  if (headers.statusCode >= 400 || headers.statusCode === 302) {
    headers.removeAllHeaders('cache-control');
  } // Never send a set-cookie header when x-moov-cache is set to true.  
  // Doing so would prevent caching as varnish will not cache a response with a set-cookie header.


  if (headers.header('x-moov-cache')) {
    headers.removeAllHeaders('set-cookie');
  }
}

function addSecureHeaders() {
  // prevents clickjacking, also known as a "UI redress attack"
  headers.header('X-Frame-Options', 'SAMEORIGIN');
  headers.header('Referrer-Policy', 'no-referrer-when-downgrade');
}
//# sourceMappingURL=responseHeaderTransform.js.map