/* jshint -W097 */
'use strict';

class Reference {
  constructor(name, refName) {
    this.name = name;
    this.reference = null;
    this.refName = refName;
    this.parent = null;
    this.type = 'Reference';
  }
  resolved(stack = []) {
    if (stack.indexOf(this) !== -1) {
      throw("References can not be circular!");
    }
    if (this.reference) {
      if (this.reference['reference']) {
        return this.reference.resolved(stack.concat([this]));
      } else {
        return this.reference;
      }
    }
    return false;

  }
}

module.exports = Reference;
