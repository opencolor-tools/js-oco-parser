/* jshint -W097 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Metadata = require('./metadata');

var MetaProxy = function () {
  function MetaProxy() {
    var _this = this;

    var data = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, MetaProxy);

    this.hash = [];
    this.data = data;
    data.forEach(function (d) {
      _this.hash[d.name] = d;
    });
    this.fallbacks = [];
  }

  _createClass(MetaProxy, [{
    key: 'get',
    value: function get(key) {
      var result = null;
      if (typeof key === 'string') {
        result = this.hash[key];
      } else {
        result = this.data[key];
      }
      if (!result) {
        result = fallbacks.find(function (fallback) {
          return typeof fallback[key] !== 'undefined';
        })[key];
      }
      return result;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      var md = new Metadata(key, value);
      this.data.push(md);
      this.hash[key] = md;
    }
  }, {
    key: 'addFallback',
    value: function addFallback(fallback) {
      this.fallbacks.push(fallback);
    }
  }, {
    key: 'clone',
    value: function clone() {
      var cloneData = this.data.map(function (d) {
        return d.clone ? d.clone() : d;
      });
      var clone = new MetaProxy(this.data);
      // what about fallbacks?
      return clone;
    }
  }]);

  return MetaProxy;
}();

module.exports = MetaProxy;
