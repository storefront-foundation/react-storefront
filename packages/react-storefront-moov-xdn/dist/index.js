"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = responseRewriter;

var _Server = _interopRequireDefault(require("react-storefront/Server"));

var _Config = _interopRequireDefault(require("react-storefront/Config"));

var _Request = _interopRequireDefault(require("./Request"));

var _Response = _interopRequireDefault(require("./Response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
useMoovAsyncTransformer();
/**
 * Provides the default functionality for scripts/index.js
 * @param {Object} options
 * @param {Object} theme The material-ui theme
 * @param {Class} model A mobx-state-tree model class that extends AppModelBase 
 * @param {React.Component} App The app react component
 * @param {Router} router An instance of react-storefront/router
 * @param {String} blob The blob 
 */

function responseRewriter(_ref) {
  var theme = _ref.theme,
      model = _ref.model,
      App = _ref.App,
      router = _ref.router,
      blob = _ref.blob;

  if (env.secure !== 'true') {
    // Always redirect on non-secure requests.
    return sendResponse({
      htmlparsed: false
    });
  } else if (env.__static_origin_path__) {
    // static assets
    fns.export('Cache', 'true');
    fns.export('Cache-Time', '2903040000'); // static paths use hash-based cache-busting, so we far-future cache them in varnish and the browser

    return sendResponse({
      htmlparsed: false
    });
  } else {
    // render the page
    _Config.default.load(blob);

    var request = new _Request.default();
    var response = new _Response.default(request);
    new _Server.default({
      theme: theme,
      model: model,
      App: App,
      router: router
    }).serve(request, response);
  }
}
//# sourceMappingURL=index.js.map