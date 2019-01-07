"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
var Headers =
/*#__PURE__*/
function () {
  function Headers() {
    var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Headers);

    for (var key in values) {
      this.set(key, values[key]);
    }
  }

  _createClass(Headers, [{
    key: "get",
    value: function get(key) {
      if (key == null) throw new Error('key cannot be null in call to headers.get()');
      return this[key.toLowerCase()];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (key == null) throw new Error('key cannot be null in call to headers.set()');
      this[key.toLowerCase()] = value;
    }
  }]);

  return Headers;
}();

exports.default = Headers;
//# sourceMappingURL=Headers.js.map