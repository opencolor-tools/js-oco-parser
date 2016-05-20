/* jshint -W097 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParserError = require('./parser_error');
var metaValue = require('./meta_value');

var MetaProxy = function () {
  function MetaProxy(parent) {
    _classCallCheck(this, MetaProxy);

    this.parent = parent;
    this.hash = {};
    this.data = [];
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
        if (this.parent.type === 'Reference') {
          result = this.parent.resolved().metadata.get(key);
        }
      }
      return result;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      value = metaValue(value);
      this.addParent(value);
      this.data.push(value);
      this.hash[key] = value;
    }
  }, {
    key: 'addParent',
    value: function addParent(element) {
      if (element['refName']) {
        element.parent = this.parent;
      }
    }
  }, {
    key: 'add',
    value: function add(metadata) {
      var _this = this;

      Object.keys(metadata).forEach(function (key) {
        if (!key.match(/\//)) {
          throw new ParserError("Metadata keys must contain at least one slash. (Failed at ''" + key + "')", {});
        }
        _this.set(key, metadata[key]);
      }, this);
    }
  }, {
    key: 'keys',
    value: function keys() {
      var onlyLocal = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var localKeys = Object.keys(this.hash);
      var remoteKeys = [];
      if (!onlyLocal && this.parent.type === 'Reference') {
        remoteKeys = this.parent.resolved().metadata.keys();
      }
      return localKeys.concat(remoteKeys);
    }
  }, {
    key: 'clone',
    value: function clone() {
      var cloneData = this.data.map(function (d) {
        return d.clone ? d.clone() : d;
      });
      var clone = new MetaProxy(cloneData);
      // what about fallbacks?
      return clone;
    }
  }]);

  return MetaProxy;
}();

module.exports = MetaProxy;
