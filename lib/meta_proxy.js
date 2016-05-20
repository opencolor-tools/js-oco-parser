'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parser_error = require('./parser_error');

var _parser_error2 = _interopRequireDefault(_parser_error);

var _meta_value = require('./meta_value');

var _meta_value2 = _interopRequireDefault(_meta_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function makeArrayUnique(inp) {
  // http://stackoverflow.com/questions/1960473/unique-values-in-an-array
  var a = [];
  for (var i = 0, l = inp.length; i < l; i++) {
    if (a.indexOf(inp[i]) === -1) {
      a.push(inp[i]);
    }
  }
  return a;
}

/**
 * MetaProxy is a way to store and retrieve metadata in various ways
 * Specifically, it handles the fallback to look up metadata on references if the proxy itself
 * doesn't have that data.
 */

var MetaProxy = function () {
  /*
   * @param parent reference to the parent object
   */

  function MetaProxy(parent) {
    _classCallCheck(this, MetaProxy);

    this.parent = parent;
    this._hash = {};
    this._data = [];
  }
  /*
   * @param {string} key key to lookup
   * @return metadate or undefined.
   */


  _createClass(MetaProxy, [{
    key: 'get',
    value: function get(key) {
      var result = null;
      if (typeof key === 'string') {
        result = this._hash[key];
      } else {
        result = this._data[key];
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
      value = (0, _meta_value2.default)(value);
      this.addParent(value);
      this._data.push(value);
      this._hash[key] = value;
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
          throw new _parser_error2.default("Metadata keys must contain at least one slash. (Failed at ''" + key + "')", {});
        }
        _this.set(key, metadata[key]);
      }, this);
    }
  }, {
    key: 'keys',
    value: function keys() {
      var onlyLocal = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var localKeys = Object.keys(this._hash);
      var remoteKeys = [];
      if (!onlyLocal && this.parent.type === 'Reference') {
        remoteKeys = this.parent.resolved().metadata.keys();
      }
      return makeArrayUnique(localKeys.concat(remoteKeys));
    }
  }]);

  return MetaProxy;
}();

exports.default = MetaProxy;
