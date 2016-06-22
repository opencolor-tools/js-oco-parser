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

/**
 * Reference is a pointer to another Palette or Color
 */

var Reference = function () {
  /**
   * Create new Reference by name and name of referenced palette or color
   * @param {string} name Name of Reference
   * @param {string} refName Name of referenced Entry
   */

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

  /**
   * @type {string}
   */


  _createClass(Reference, [{
    key: 'rename',


    /**
     * Rename or Move Reference to different place in OCO tree
     * @param {string} newName new name or dotpath
     */
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

    /**
     * @return absolute dotpath for the referenced Entry
     */

  }, {
    key: 'resolveRefName',


    /**
     * Recursively resolve a reference name in the OCO tree
     * @param current entry to resolve from
     * @param {string[]} refPath current an array of path elements
     * @param {boolean} [notUp=false] if true, resolving only continues downwards a tree branch
     * @return {string} a resolved absolute path
     */
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
    /**
     * path of this Reference within the OCO tree
     * @return {string} dotpath
     */

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
    /** @ignore */

  }, {
    key: 'isRoot',
    value: function isRoot() {
      return false;
    }
    /**
     * Returns root of OCO tree
     * @return Root of OCO tree
     */

  }, {
    key: 'root',
    value: function root() {
      if (this.isRoot()) {
        return this;
      } else {
        return this.parent.root();
      }
    }
    /**
     * Moves current element to a new place in the OCO tree
     * @param {string} newPath new dotpath to move to
     * @param {boolean} [maintainReferences=true] If true, references will be moved accordingly
     */

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
    /**
     * Returns the Entry this reference is pointing to
     * @return Entry referenced or null if reference doesn't point to something valid
     */

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
    /**
     * Resolve reference. Only resolves once, so use resolved to actually to full resolving
     * @param current Current starting point (Entry) to resolve from
     * @param {string[]} refPath array of path fragments to resolve
     * @param {boolean} [notUp=false] if true, don't climb up the tree
     * @return resolved Entry or null if reference points to nothing
     */

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
    /** @ignore */

  }, {
    key: 'addParent',
    value: function addParent(element) {
      if (element['refName']) {
        element.parent = this;
      }
    }
    /** @ignore */

  }, {
    key: 'addMetadata',
    value: function addMetadata(metadata) {
      this.metadata.add(metadata);
    }

    /** @ignore */

  }, {
    key: 'getMetadata',
    value: function getMetadata(key) {
      return this.metadata.get(key);
    }

    /**
     * Clone this Reference
     * @todo does this ignore Metadata by design?
     * @return {Reference} clone of current reference
     */

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
      var refPath = this.refName.split('.');
      var refName = this.resolveRefName(this.parent, refPath);
      return refName;
    }
  }]);

  return Reference;
}();

exports.default = Reference;
