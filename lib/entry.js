/* jshint -W097 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function flatten(ary) {
  var ret = [];
  for (var i = 0; i < ary.length; i++) {
    if (Array.isArray(ary[i])) {
      ret = ret.concat(flatten(ary[i]));
    } else {
      ret.push(ary[i]);
    }
  }
  return ret;
}

var Entry = function () {
  function Entry(name, children, type, position) {
    _classCallCheck(this, Entry);

    this.name = name || 'Root';
    this.position = position;
    this.metadata = {};
    this.children = [];
    this.childKeys = {};
    this.parent = null;
    this.type = type || (this.name === 'Root' ? 'Root' : 'Entry');
    this.addChildren(flatten(children || []), false);
    this.validateType();
    this.forEach = Array.prototype.forEach.bind(this.children); // the magic of JavaScript.
  }

  _createClass(Entry, [{
    key: 'get',
    value: function get(nameOrIndex) {
      if ('string' === typeof nameOrIndex) {
        return this.children[this.childKeys[nameOrIndex]];
      } else {
        return this.children[nameOrIndex];
      }
    }
  }, {
    key: 'addParent',
    value: function addParent(element) {
      if (element['refName']) {
        element.parent = this;
      }
    }
  }, {
    key: 'addChild',
    value: function addChild(child) {
      var _this = this;

      var validate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var type = child.type;
      // we're basically only separating meta data.
      if (type === 'Metadata') {
        this.metadata[child.name] = child.value;
        this.addParent(this.metadata[child.name]);
      } else if (type === 'Metablock') {
        var prefix = child.name + "/";
        Object.keys(child.metadata).forEach(function (key) {
          var combinedKey = (prefix + key).replace(/\/\//g, '/'); // normalize keys
          _this.metadata[combinedKey] = child.metadata[key];
          _this.addParent(_this.metadata[combinedKey]);
        });
      } else {
        if ('undefined' !== typeof this.childKeys[child.name]) {
          // name collision. just overwrite as yaml would probably do.
          this.children[this.childKeys[child.name]] = child;
        } else {
          var newIndex = this.children.length;
          this.children.push(child);
          this.childKeys[child.name] = newIndex;
        }
      }
      child.parent = this;
      if (validate) {
        this.validateType();
      }
    }
  }, {
    key: 'addChildren',
    value: function addChildren(children) {
      var _this2 = this;

      children.forEach(function (child) {
        _this2.addChild(child, false);
      }, this);
    }
  }, {
    key: 'validateType',
    value: function validateType() {
      var types = [];
      this.children.forEach(function (child) {
        var type = child.constructor.name;
        if (types.indexOf(type) === -1) {
          types.push(type);
        }
      });
      types = types.sort();
      if (types.indexOf('ColorValue') !== -1 && types.indexOf('Color') !== -1) {
        throw 'Entry "' + this.name + '" cannot contain colors and color values at the same level (line: ' + this.position.first_line + ')';
      }
      if (types.indexOf('Entry') !== -1 && types.indexOf('ColorValue') !== -1) {
        throw 'Entry "' + this.name + '" cannot contain palette and color values at the same level (line: ' + this.position.first_line + ')';
      }
      if (types.indexOf('ColorValue') !== -1 && this.type === 'Entry') {
        this.type = 'Color';
      }
    }
  }]);

  return Entry;
}();

module.exports = Entry;
