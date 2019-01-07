"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = edgeRequestTransform;

var _createRequest = _interopRequireDefault(require("./createRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * Helper for moov_edge_request_transform.js
 * @param {Object} options
 * @param {Function} options.setCacheKey A function to register a callback to set a cache key for the current request.
 * @param {Router} options.router The app's router
 */
function edgeRequestTransform(_ref) {
  var setCacheKey = _ref.setCacheKey,
      router = _ref.router;
  // Here we support custom server cache keys via server.key in cache route handlers.
  setCacheKey(function (defaults) {
    var request = (0, _createRequest.default)();
    return router.getCacheKey(request, defaults);
  });
}
//# sourceMappingURL=edgeRequestTransform.js.map