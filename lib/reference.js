/* jshint -W097 */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reference = function Reference(name, refName) {
  _classCallCheck(this, Reference);

  this.name = name;
  this.reference = null;
  this.refName = refName;
  this.parent = null;
  this.type = 'Reference';
};

module.exports = Reference;
