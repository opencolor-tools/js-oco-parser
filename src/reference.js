/* jshint -W097 */
'use strict';

class Reference {
  constructor(name, refName) {
    this.name = name;
    this.refName = refName;
    this.parent = null;
    this.type = 'Reference';
  }
  get absoluteRefName() {
    var refPath = this.refName.split(".");
    var refName = this.resolveRefName(this.parent, refPath);
    return refName;
  }
  resolveRefName(current, refPath, notUp) {
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
  path() {
    if (!this.parent) { return ''; }
    return [this.parent.path(), this.name].filter((e) => e !== '').join('.');
  }
  isRoot() {
    return false;
  }
  resolved(stack = []) {
    if (stack.indexOf(this) !== -1) {
      throw("References can not be circular!");
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

  resolve(current, refPath, notUp) {
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

  clone() {
    var clone =  new Reference(this.name, this.refName);
    return clone;
  }
}

module.exports = Reference;
