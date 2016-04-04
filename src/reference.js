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
}

module.exports = Reference;
