"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRequest;

var _getHeaders = _interopRequireDefault(require("./getHeaders"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * Creates a request object for route handlers from the moovjs environment.
 * @return {Object}
 */
function createRequest() {
  var _env$path$split = env.path.split(/\?/),
      _env$path$split2 = _slicedToArray(_env$path$split, 2),
      pathname = _env$path$split2[0],
      search = _env$path$split2[1];

  return {
    sendResponse: global.sendResponse,
    body: global.requestBody,
    headers: env.headers ? JSON.parse(env.headers) : (0, _getHeaders.default)(),
    pathname: pathname,
    search: search ? "?".concat(search) : '',
    method: env.method,
    port: env.host.split(/:/)[1] || (env.secure ? '443' : '80'),
    hostname: env.host_no_port,
    protocol: env.host_no_port === 'localhost' ? 'http:' : env.secure ? 'https:' : 'http:',

    get path() {
      return env.path;
    }

  };
}
//# sourceMappingURL=createRequest.js.map