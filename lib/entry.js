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

    this._name = name || 'Root';
    this.position = position;
    this.metadata = {};
    this.children = [];
    this.parent = null;
    this.type = type || 'Palette';

    this.addChildren(flatten(children || []), false);
    this.validateType();
    this.forEach = Array.prototype.forEach.bind(this.children); // the magic of JavaScript.
  }

  _createClass(Entry, [{
    key: 'get',
    value: function get(nameOrIndex) {
      if ('string' === typeof nameOrIndex) {
        if (nameOrIndex.match(/\./)) {
          // dotpath, so we need to do a deep lookup
          var pathspec = nameOrIndex.split(".");
          return this.get(pathspec.shift()).get(pathspec.join("."));
        }
        return this.children.filter(function (child) {
          return child.name === nameOrIndex;
        }).pop();
      } else {
        return this.children[nameOrIndex];
      }
    }
  }, {
    key: 'remove',
    value: function remove(path) {
      var entry = this.get(path);
      if (!entry) {
        return;
      }
      entry.parent.removeChild(entry);
      // if there are multiple children with the same dotpath
      this.remove(path);
    }
  }, {
    key: 'set',
    value: function set(nameOrIndex, value) {
      if ('string' === typeof nameOrIndex) {
        if (nameOrIndex.match(/\./)) {
          // dotpath, so we need to do a deep lookup
          var pathspec = nameOrIndex.split(".");
          var firstPart = pathspec.shift();
          var existingEntry = this.get(firstPart);
          if (existingEntry && existingEntry.type === 'Palette') {
            existingEntry.set(pathspec.join("."), value);
          } else {
            var newGroup = new Entry(firstPart);
            this.set(firstPart, newGroup);
            newGroup.set(pathspec.join("."), value);
          }
        } else {
          if (this.get(nameOrIndex)) {
            this.get(nameOrIndex).parent = null; // nullifying ref
            this.children.filter(function (child) {
              return child.name === nameOrIndex;
            }).forEach(function (child) {
              child.value = value;
            });
            value.name = nameOrIndex;
          } else {
            this.children.push(value);
            value.name = nameOrIndex;
          }
          value.parent = this;
        }
      } else {
        if (this.children[nameOrIndex]) {
          this.children[nameOrIndex].parent = null; // nullifying reference
        }
        this.children[nameOrIndex] = value;
        value.parent = this;
      }
    }
  }, {
    key: 'path',
    value: function path() {
      if (!this.parent) {
        return '';
      } // we don't actually want to have the root in there.
      return [this.parent.path(), this.name].filter(function (e) {
        return e !== '';
      }).join('.');
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
    key: 'removeChild',
    value: function removeChild(child) {
      var index = this.children.indexOf(child);
      this.children = this.children.slice(0, index).concat(this.children.slice(index + 1));
    }
  }, {
    key: 'addChild',
    value: function addChild(child) {
      var _this2 = this;

      var validate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!child) {
        return;
      }
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
        this.children.push(child);
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
        var type = child.type;
        if (types.indexOf(type) === -1) {
          types.push(type);
        }
      });
      types = types.sort();
      if (types.indexOf('ColorValue') !== -1 && types.indexOf('Color') !== -1) {
        var message = 'Palette "' + this.name + '" cannot contain colors and color values at the same level (line: ' + (this.position.first_line - 1) + ')';
        throw new ParserError(message, { line: this.position.first_line });
      }
      if (types.indexOf('Palette') !== -1 && types.indexOf('ColorValue') !== -1) {
        var _message = 'Palette "' + this.name + '" cannot contain palette and color values at the same level (line: ' + (this.position.first_line - 1) + ')';
        throw new ParserError(_message, { line: this.position.first_line });
      }
      if (types.indexOf('ColorValue') !== -1 && this.type === 'Palette') {
        this.type = 'Color';
      }
    }
  }, {
    key: 'traverseTree',
    value: function traverseTree(filters, callback) {
      var filter = false;
      if (typeof filters === 'string') {
        filters = [filters];
      }
      if (filters && filters.length > 0) {
        filter = true;
      }
      this.children.forEach(function (child) {
        if (child.type != 'ColorValue' && (!filter || filters.indexOf(child.type) !== -1)) {
          callback(child);
        }
        if (child.children && child.children.length > 0) {
          child.traverseTree(filters, callback);
        }
      });
    }
  }, {
    key: 'hexcolor',
    value: function hexcolor() {
      var withAlpha = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (this.type !== 'Color') {
        return null;
      }
      var identifiedColor = this.children.filter(function (child) {
        return child.identified === true;
      })[0];
      if (identifiedColor) {
        return identifiedColor.hexcolor(withAlpha);
      }
      return null;
    }
  }, {
    key: 'clone',
    value: function clone() {
      var children = this.children.map(function (child) {
        return child.clone();
      });
      var clone = new Entry(this.name, children, this.type, this.position);
      clone.metadata = this.metadata;
      return clone;
    }
  }, {
    key: 'name',
    set: function set(newName) {
      this._name = newName.replace(/\./g, '');
    },
    get: function get() {
      return this._name;
    }
  }]);

  return Entry;
}();

module.exports = Entry;
