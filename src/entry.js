/* jshint -W097 */
'use strict';

function flatten(ary) {
  var ret = [];
  for(var i = 0; i < ary.length; i++) {
    if(Array.isArray(ary[i])) {
      ret = ret.concat(flatten(ary[i]));
    } else {
      ret.push(ary[i]);
    }
  }
  return ret;
}

class Entry {
  constructor(name, children, type, position) {
    this.name = name;
    this.position = position;
    this.metadata = {};
    this.children = [];
    this.childKeys = {};
    this.parent = null;
    this.type = type || 'Entry';
    this.addChildren(flatten(children));
    this.validateType();
    this.forEach = Array.prototype.forEach.bind(this.children); // the magic of JavaScript.

  }
  get(nameOrIndex) {
    if ('string' === typeof nameOrIndex) {
      return this.children[this.childKeys[nameOrIndex]];
    } else {
      return this.children[nameOrIndex];
    }
  }
  addChildren(children) {
    children.forEach((child) => {
      var type = child.type;
      // we're basically only separating meta data.
      if (type === 'Metadata') {
        this.metadata[child.name] = child.value;
      } else if (type === 'Metablock') {
        var prefix = child.name + "/";
        Object.keys(child.metadata).forEach((key) => {
          var combinedKey = (prefix + key).replace(/\/\//g, '/'); // normalize keys
          this.metadata[combinedKey] = child.metadata[key];
        });
      } else {
        if ('undefined' !== typeof this.childKeys[child.name]) { // name collision. just overwrite as yaml would probably do.
          this.children[this.childKeys[child.name]] = child;
        } else {
          var newIndex = this.children.length;
          this.children.push(child);
          this.childKeys[child.name] = newIndex;
        }
      }
      child.parent = this;
    });
  }
  validateType() {
    var types = [];
    this.children.forEach((child) => {
      let type = child.constructor.name;
      if (types.indexOf(type) === -1) { types.push(type); }
    });
    types = types.sort();
    if (types.indexOf('ColorValue') !== -1 && types.indexOf('Color') !== -1 ) {
      throw('Entry "' + this.name + '" cannot contain colors and color values at the same level (line: ' + this.position.first_line + ')');
    }
    if (types.indexOf('Entry') !== -1 && types.indexOf('ColorValue') !== -1) {
      throw('Entry "' + this.name + '" cannot contain palette and color values at the same level (line: ' + this.position.first_line + ')');
    }
    if (types.indexOf('ColorValue') !== -1 && this.type === 'Entry') {
      this.type = 'Color';
    }
  }

  resolve(current, path, notUp) {
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

  resolveChild(child) {
    if (child['resolveReferences']) {
      child.resolveReferences();
    }
    if (child['refName']) { // look ma, it's a reference
      var refPath = child.refName.split(".");
      child.reference = this.resolve(this, refPath);
    }
  }

  resolveReferences() {
    Object.keys(this.metadata).forEach((key) => {
      this.resolveChild(this.metadata[key]);
    });
    this.children.forEach(this.resolveChild, this);
  }

}
module.exports = Entry;
