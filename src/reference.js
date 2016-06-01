/* jshint -W097 */
'use strict';

const URL_REFERENCE_FILE_PROTOCOL = '__URL_file_'
class Reference {
  constructor(name, refName) {
    this._name = name;
    this.refName = refName;
    this.parent = null;
    this.type = 'Reference';
  }
  set name(newName) {
    newName = newName.replace(/[\.\/]/g, '');
    this._name = newName;
  }
  get name() {
    return this._name;
  }
  rename(newName) {
    newName = newName.replace(/[\.\/]/g, '');
    if(this.isRoot()) {
      this._name = newName;
    } else {
      let newPath = [this.parent.path(), newName].filter((e) => e !== '').join('.');
      this.moveTo(newPath);
    }
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
  root() {
    if(this.isRoot()) {
      return this;
    } else {
      return this.parent.root();
    }
  }
  moveTo(newPath, maintainReferences = true) {
    let oldPath = this.path();
    if(maintainReferences) {
      this.root().updateReferences(oldPath, newPath);
    }
    this.parent.removeChild(this);
    this.root().set(newPath, this);
  }
  resolved(stack = []) {
    if (stack.indexOf(this) !== -1) {
      throw("References can not be circular!");
    }
    if(this.refName.indexOf(URL_REFERENCE_FILE_PROTOCOL) !== -1) {
      return this.root().referenceResolver(this.refName.replace(URL_REFERENCE_FILE_PROTOCOL, ''));
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
