"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NO_CACHE_HEADER = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * The standard cache-control header value sent for all resources that are not to be cached.
 */
var NO_CACHE_HEADER = 'no-cache';
/**
 * Represents the response sent back from fromServer handlers.  Use this class to set headers, status,
 * and other response metadata.
 */

exports.NO_CACHE_HEADER = NO_CACHE_HEADER;

var Response =
/*#__PURE__*/
function () {
  /**
   * When set, this determines the value of the location header
   */

  /**
   * Set to false to prevent set-cookie headers returned from the upstream (proxied) site from
   * being relayed to the browser
   */

  /**
   * This will be flipped to `true` when send is called.
   */

  /**
   * The application/json mime type
   */

  /**
   * The text/html mime type
   */

  /**
   * Response headers to send
   */

  /**
   * The default cache settings for browser and server cache.  Override this by calling cacheOnServer
   */
  function Response(request) {
    _classCallCheck(this, Response);

    _defineProperty(this, "redirectTo", null);

    _defineProperty(this, "shouldRelayUpstreamCookies", true);

    _defineProperty(this, "headersSent", false);

    _defineProperty(this, "JSON", 'application/json');

    _defineProperty(this, "HTML", 'text/html');

    _defineProperty(this, "headers", {});

    _defineProperty(this, "cache", {
      browserMaxAge: 0,
      serverMaxAge: 0
      /**
       * Cookies to set
       */

    });

    _defineProperty(this, "cookies", []);

    this.request = request;
    var headers = global.headers || {
      statusCode: 200,
      statusText: 'OK'
    };
    this.statusCode = Number(headers.statusCode);
    this.statusText = headers.statusText;
  }
  /**
   * Sends response content
   * @param {String} body The body of the response
   * @return {Response} this
   */


  _createClass(Response, [{
    key: "send",
    value: function send(body) {
      this._doRelayUpstreamCookies();

      global.fns.export('MOOV_PWA_RESPONSE', {
        statusCode: this.statusCode,
        statusText: this.statusText,
        redirectTo: this.redirectTo,
        headers: this.headers,
        cookies: this.cookies,
        cache: this.cache
      });
      this.request.sendResponse({
        body: body,
        htmlparsed: body != null
      });
      this.headersSent = true;
      return this;
    }
    /**
     * Sends JSON data
     * @param {Object} body Data
     * @return {Response} this
     */

  }, {
    key: "json",
    value: function json(body) {
      return this.set('content-type', this.JSON).send(JSON.stringify(body));
    }
    /**
     * Configure whether or not set-cookie headers from upstream should be sent down to the browser
     * @param {Boolean} shouldRelay True to relay upstream set-cookie headers to the browser, false to not
     */

  }, {
    key: "relayUpstreamCookies",
    value: function relayUpstreamCookies(shouldRelay) {
      this.shouldRelayUpstreamCookies = shouldRelay;
      return this;
    }
    /**
     * Relays all set-cookie headers received from fetch requests back to the browser, 
     * translating each to the current domain.
     * @private
     */

  }, {
    key: "_doRelayUpstreamCookies",
    value: function _doRelayUpstreamCookies() {
      var cookiesByDomain = env.MUR_SET_COOKIES;

      if (this.shouldRelayUpstreamCookies && cookiesByDomain) {
        for (var domain in cookiesByDomain) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = cookiesByDomain[domain][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var cookie = _step.value;
              // add a cookie for the current request's domain (for projects that don't have a proper DNS entry, for example localhost or moveapp.com)
              cookie = cookie.replace(/Domain=[^;]*(;\s*|\s*$)/gi, '');
              var upstream = injectDomain(cookie, domain);
              var app = injectDomain(cookie, this.request.hostname);
              this.cookies.push(upstream);
              if (app !== upstream) this.cookies.push(cookie);
            }
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
        }
      }
    }
    /**
     * Sets a response header
     * @param {String} name
     * @param {String} value
     * @return {Response} this
     */

  }, {
    key: "set",
    value: function set(name, value) {
      if (name.match(/set-cookie/i) && !env.shouldSendCookies) {
        console.warn('[react-storefront response]', 'Cannot set cookies on cached route');
      }

      if (name == null) throw new Error('name cannot be null in call to response.set');
      this.headers[name] = value;
      return this;
    }
    /**
     * Gets the value of a header by name (case insensitive)
     * @param {String} name 
     * @return {String} The header value
     */

  }, {
    key: "get",
    value: function get(name) {
      return this.headers[name.toLowerCase()];
    }
    /**
     * Sets the response status
     * @param {String} code 
     * @param {String} text 
     * @return {Response} this
     */

  }, {
    key: "status",
    value: function status(code, text) {
      this.statusCode = code;
      this.statusText = text;
      return this;
    }
    /**
     * Caches the response on the server
     * @param {Number} maxAgeSeconds The time the entry should live in the cache in seconds
     * @return {Response} this
     */

  }, {
    key: "cacheOnServer",
    value: function cacheOnServer(maxAgeSeconds) {
      if (maxAgeSeconds == null) throw new Error('maxAgeSeconds cannot be null in call to response.cacheOnServer');
      this.cache = {
        serverMaxAge: maxAgeSeconds,
        browserMaxAge: 0
      };
      return this;
    }
    /**
     * Sends a redirect to the specified URL
     * @param {String} url A url
     * @param {Number} status The http status code to send
     * @return {Response} this
     */

  }, {
    key: "redirect",
    value: function redirect(url) {
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 301;
      if (url == null) throw new Error('url cannot be null in call to response.redirect');
      this.redirectTo = url;
      this.statusCode = status;
      this.send();
      return this;
    }
  }]);

  return Response;
}();
/**
 * Injects a domain into a set-cookie header
 * @param {String} cookie 
 * @param {String} domain
 * @return {String} 
 */


exports.default = Response;

function injectDomain(cookie, domain) {
  var idx = cookie.indexOf(';') + 1;
  return "".concat(cookie.substr(0, idx), " Domain=").concat(domain, "; ").concat(cookie.substr(idx).trim());
}
//# sourceMappingURL=Response.js.map