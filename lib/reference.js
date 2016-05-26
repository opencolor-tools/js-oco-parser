/* jshint -W097 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reference = function () {
  function Reference(name, refName) {
    _classCallCheck(this, Reference);

    this.name = name;
    this.refName = refName;
    this.parent = null;
    this.type = 'Reference';
  }

  _createClass(Reference, [{
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
    key: 'resolved',
    value: function resolved() {
      var stack = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      if (stack.indexOf(this) !== -1) {
        throw "References can not be circular!";
      }
      var refPath = this.refName.split(".");
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
    key: 'clone',
    value: function clone() {
      var clone = new Reference(this.name, this.refName);
      return clone;
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

module.exports = Reference;
