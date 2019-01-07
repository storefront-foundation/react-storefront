"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getHeaders = _interopRequireDefault(require("./getHeaders"));

var _qs = _interopRequireDefault(require("qs"));

var _parseMultipartRequest = _interopRequireDefault(require("./parseMultipartRequest"));

var _Headers = _interopRequireDefault(require("./Headers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Creates a request object for route handlers from the moovjs environment.
 * @return {Object}
 */
var Request =
/*#__PURE__*/
function () {
  function Request() {
    _classCallCheck(this, Request);

    var _env$path$split = env.path.split(/\?/),
        _env$path$split2 = _slicedToArray(_env$path$split, 2),
        path = _env$path$split2[0],
        search = _env$path$split2[1];

    Object.assign(this, {
      sendResponse: global.sendResponse,
      headers: new _Headers.default(env.headers ? JSON.parse(env.headers) : (0, _getHeaders.default)()),
      path: path,
      search: search ? "?".concat(search) : '',
      query: _qs.default.parse(search),
      method: env.method,
      port: env.host.split(/:/)[1] || (env.secure ? '443' : '80'),
      hostname: env.host_no_port,
      protocol: env.host_no_port === 'localhost' ? 'http:' : env.secure ? 'https:' : 'http:'
    });
    this.body = parseBody(this);
  }

  _createClass(Request, [{
    key: "pathname",
    get: function get() {
      console.warn('warning: request.pathname is deprecated and will be removed in a future version of react-storefront-moov-xdn');
      return this.path;
    }
  }]);

  return Request;
}();
/**
 * Parses JSON and form body content
 * @private
 * @param {String} body The request body
 * @param {String} contentType The content-type header
 * @return {Object}
 */


exports.default = Request;

function parseBody(request) {
  var contentType = (request.headers.get('content-type') || '').toLowerCase();
  var body = global.requestBody;

  if (contentType === 'application/json') {
    try {
      return JSON.parse(body);
    } catch (e) {
      throw new Error('could not parse request body as application/json: ' + e.message);
    }
  } else if (contentType === 'application/x-www-form-urlencoded') {
    return _qs.default.parse(body);
  } else if (contentType.startsWith('multipart/form-data')) {
    try {
      return (0, _parseMultipartRequest.default)(body, contentType);
    } catch (e) {
      throw new Error('could not parse request body as multipart/form-data: ' + e.message);
    }
  }
}
//# sourceMappingURL=Request.js.map