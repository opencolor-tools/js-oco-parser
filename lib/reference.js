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

var Reference = function () {
  function Reference(name, refName) {
    _classCallCheck(this, Reference);

    this._name = name;
    this.refName = refName;
    if (this.refName.match(/^=/)) {
      this.refName = this.refName.replace(/^= ?/, '');
    }
    this.parent = null;
    this.type = 'Reference';
    this.metadata = new _meta_proxy2.default(this);
  }

  _createClass(Reference, [{
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
    key: 'resolveRefName',
    value: function resolveRefName(current, refPath, notUp) {
      var resolvedEntry = current.get(refPath[0]);
      if (resolvedEntry) {
        if (refPath.length > 1) {
          return this.resolveRefName(resolvedEntry, refPath.slice(1), true);
        } else {
          return resolvedEntry.path();
        }
      }
      if (current.parent && !notUp) {
        return this.resolveRefName(current.parent, refPath);
      } else {
        return null;
      }
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
    key: 'isRoot',
    value: function isRoot() {
      return false;
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
    key: 'resolved',
    value: function resolved() {
      var stack = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      if (stack.indexOf(this) !== -1) {
        throw new _parser_error2.default('References can not be circular!', {});
      }
      var refPath = this.refName.split('.');
      var reference = this.resolve(this.parent, refPath);
      if (reference) {
        if (reference['refName']) {
          return reference.resolved(stack.concat([this]));
        } else {
          return reference;
        }
      }
      return null;
    }
  }, {
    key: 'resolve',
    value: function resolve(current, refPath, notUp) {
      var resolved = current.get(refPath[0]);
      if (resolved) {
        if (refPath.length > 1) {
          resolved = this.resolve(resolved, refPath.slice(1), true);
        }
        if (resolved) {
          return resolved;
        }
      }
      if (current.parent && !notUp) {
        return this.resolve(current.parent, refPath);
      } else {
        return null;
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
      this.metadata.add(metadata);
    }
  }, {
    key: 'getMetadata',
    value: function getMetadata(key) {
      return this.metadata.get(key);
    }
  }, {
    key: 'clone',
    value: function clone() {
      var clone = new Reference(this.name, this.refName);
      return clone;
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
  }, {
    key: 'absoluteRefName',
    get: function get() {
      var refPath = this.refName.split(".");
      var refName = this.resolveRefName(this.parent, refPath);
      return refName;
    }
  }]);

  return Reference;
}();

exports.default = Reference;
