'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parser_error = require('./parser_error');

var _parser_error2 = _interopRequireDefault(_parser_error);

var _meta_proxy = require('./meta_proxy');

var _meta_proxy2 = _interopRequireDefault(_meta_proxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    this._name = name || 'Root';
    this.position = position;
    this.children = [];
    this.parent = null;
    this.metadata = new _meta_proxy2.default(this);
    this.type = type || 'Palette';

    this.addChildren(flatten(children || []), false);
    this.validateType();
    this.forEach = Array.prototype.forEach.bind(this.children); // the magic of JavaScript.
  }

  _createClass(Entry, [{
    key: 'rename',
    value: function rename(newName) {
      newName = newName.replace(/[\.\/]/g, '');
      if (this.isRoot()) {
        this._name = newName;
      } else {
        var newPath = [this.parent.path(), newName].filter(function (e) {
          return e !== '';
        }).join('.');
        this.moveTo(newPath);
      }
    }
  }, {
    key: 'get',
    value: function get(nameOrIndex) {
      if (typeof nameOrIndex === 'string') {
        if (nameOrIndex.match(/\./)) {
          // dotpath, so we need to do a deep lookup
          var pathspec = nameOrIndex.split('.');
          var first = this.get(pathspec.shift());
          if (!first) {
            return undefined;
          }
          return first.get(pathspec.join('.'));
        }
        return this.children.filter(function (child) {
          return child.name === nameOrIndex;
        }).pop();
      } else {
        return this.children[nameOrIndex];
      }
    }
  }, {
    key: 'isRoot',
    value: function isRoot() {
      return !this.parent;
    }
  }, {
    key: 'root',
    value: function root() {
      if (this.isRoot()) {
        return this;
      } else {
        return this.parent.root();
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
    value: function set(path, entry) {
      var _this = this;

      if (path.match(/\./)) {
        // dotpath, so we need to do a deep lookup
        var pathspec = path.split('.');
        var firstPart = pathspec.shift();
        var existingEntry = this.get(firstPart);
        if (existingEntry && existingEntry.type === 'Palette') {
          existingEntry.set(pathspec.join('.'), entry);
        } else {
          var newGroup = new Entry(firstPart);
          this.set(firstPart, newGroup);
          newGroup.set(pathspec.join('.'), entry);
        }
      } else {
        if (path !== entry.name) {
          entry.name = path;
        }
        entry.parent = this;
        if (this.get(path)) {
          // replace existing entries
          this.children.filter(function (child) {
            return child.name === path;
          }).forEach(function (child) {
            _this.replaceChild(child, entry);
          });
        } else {
          // add entry
          this.children.push(entry);
        }
      }
    }
  }, {
    key: 'updateReferences',
    value: function updateReferences(oldPath, newPath) {
      var _this2 = this;

      this.traverseTree(['Reference'], function (entry) {
        if (entry.absoluteRefName && entry.absoluteRefName.indexOf(oldPath) === 0) {
          entry.refName = entry.absoluteRefName.replace(oldPath, newPath);
          _this2.set(entry.path(), entry);
        }
      });
    }
  }, {
    key: 'moveTo',
    value: function moveTo(newPath) {
      var maintainReferences = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var oldPath = this.path();
      if (maintainReferences) {
        this.root().updateReferences(oldPath, newPath);
      }
      this.parent.removeChild(this);
      this.root().set(newPath, this);
    }
  }, {
    key: 'path',
    value: function path() {
      if (!this.parent) {
        return '';
      }
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
      this.metadata.add(metadata); // transitioning
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      var index = this.children.indexOf(child);
      this.children = this.children.slice(0, index).concat(this.children.slice(index + 1));
    }
  }, {
    key: 'replaceChild',
    value: function replaceChild(child, newEntry) {
      var currentPosition = this.children.indexOf(child);
      this.children.splice(currentPosition, 1, newEntry);
    }
  }, {
    key: 'addChild',
    value: function addChild(child) {
      var validate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
      var position = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];

      if (!child) {
        return;
      }
      var type = child.type;
      // we're basically only separating meta data.
      if (type === 'Metadata') {
        throw new Error('API error, please use .addMetadata or .metadata.add instead');
      } else if (type === 'Metablock') {
        throw new Error('API error, please use .addMetadata or .metadata.add instead');
      } else {
        child.parent = this;
        if (position === -1) {
          this.children.push(child);
        } else {
          this.children.splice(position, 0, child);
        }
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
      });
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
        throw new _parser_error2.default(message, { line: this.position.first_line });
      }
      if (types.indexOf('Palette') !== -1 && types.indexOf('ColorValue') !== -1) {
        var _message = 'Palette "' + this.name + '" cannot contain palette and color values at the same level (line: ' + (this.position.first_line - 1) + ')';
        throw new _parser_error2.default(_message, { line: this.position.first_line });
      }
      if (types.indexOf('ColorValue') !== -1 && this.type === 'Palette') {
        this.type = 'Color';
      }
    }
  }, {
    key: 'getMetadata',
    value: function getMetadata(key) {
      return this.metadata.get(key);
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
        if (child.type !== 'ColorValue' && (!filter || filters.indexOf(child.type) !== -1)) {
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
        return child.isHexExpressable();
      })[0];
      if (identifiedColor) {
        return identifiedColor.hexcolor(withAlpha);
      }
      return null;
    }
  }, {
    key: 'clone',
    value: function clone() {
      var _this4 = this;

      var children = this.children.map(function (child) {
        return child.clone();
      });
      var clone = new Entry(this.name, children, this.type, this.position);
      this.metadata.keys().forEach(function (key) {
        var meta = _this4.metadata.get(key);
        clone.metadata.set(key, meta.clone ? meta.clone() : meta);
      });
      return clone;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return JSON.stringify(this, function (key, value) {
        if (key === 'parent' && value) {
          return value.path();
        } else {
          return value;
        }
      }, '  ');
    }
  }, {
    key: 'name',
    set: function set(newName) {
      newName = newName.replace(/[\.\/]/g, '');
      this._name = newName;
    },
    get: function get() {
      return this._name;
    }
  }]);

  return Entry;
}();

exports.default = Entry;
