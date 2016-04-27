/* jshint -W097 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reference = require('./reference');
var ColorValue = require('./color_value');
var ParserError = require('./parser_error');

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
    if (arguments.length === 0) {
      this.type = 'Root';
    } else {
      this.type = type || 'Entry';
    }
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
    key: 'addMetadata',
    value: function addMetadata(metadata) {
      var _this = this;

      Object.keys(metadata).forEach(function (key) {
        if (!key.match(/\//)) {
          throw new ParserError("Metadata keys must contain at least one slash. (Failed at ''" + key + "')"), {};
        }
        if (typeof metadata[key] === 'string') {
          if (metadata[key].match(/^=/)) {
            // shortcut for creating references
            var name = metadata[key].slice(1).trim();
            metadata[key] = new Reference('metachild', name);
          } else if (metadata[key].match(/^#([a-fA-F0-9]){3,8}/) || metadata[key].match(/^rgba?\(.*\)$/)) {
            // shortcut for creating colors
            metadata[key] = ColorValue.fromColorValue(metadata[key]);
          }
        }
        _this.metadata[key] = metadata[key];
        _this.addParent(_this.metadata[key]);
      });
    }
  }, {
    key: 'addChild',
    value: function addChild(child) {
      var _this2 = this;

      var validate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!child) {
        return;
      }
      //console.log("add child", child);
      var type = child.type;
      // we're basically only separating meta data.
      if (type === 'Metadata') {
        this.metadata[child.name] = child.value;
        this.addParent(this.metadata[child.name]);
      } else if (type === 'Metablock') {
        var prefix = child.name + "/";
        Object.keys(child.metadata).forEach(function (key) {
          var combinedKey = (prefix + key).replace(/\/\//g, '/'); // normalize keys
          _this2.metadata[combinedKey] = child.metadata[key];
          _this2.addParent(_this2.metadata[combinedKey]);
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
        child.parent = this;
      }

      if (validate) {
        this.validateType();
      }
    }
  }, {
    key: 'addChildren',
    value: function addChildren(children) {
      var _this3 = this;

      children.forEach(function (child) {
        _this3.addChild(child, false);
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
        var message = 'Entry "' + this.name + '" cannot contain colors and color values at the same level (line: ' + (this.position.first_line - 1) + ')';
        throw new ParserError(message, { line: this.position.first_line });
      }
      if (types.indexOf('Entry') !== -1 && types.indexOf('ColorValue') !== -1) {
        var _message = 'Entry "' + this.name + '" cannot contain palette and color values at the same level (line: ' + (this.position.first_line - 1) + ')';
        throw new ParserError(_message, { line: this.position.first_line });
      }
      if (types.indexOf('ColorValue') !== -1 && this.type === 'Entry') {
        this.type = 'Color';
      }
    }
  }]);

  return Entry;
}();

module.exports = Entry;
