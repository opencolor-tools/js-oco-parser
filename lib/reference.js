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
    value: function resolve(current, path, notUp) {
      var resolved = current.get(path[0]);
      if (resolved) {
        if (path.length > 1) {
          resolved = this.resolve(resolved, path.slice(1), true);
        }
        if (resolved) {
          return resolved;
        }
      }
      if (current.parent && !notUp) {
        return this.resolve(current.parent, path);
      } else {
        return null;
      }
    }
  }]);

  return Reference;
}();

module.exports = Reference;
