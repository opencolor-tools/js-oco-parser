/* jshint -W097 */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Metadata = function Metadata(name, value) {
  _classCallCheck(this, Metadata);

  this.name = name;
  this.value = value;
  this.type = 'Metadata';
  this.parent = null;
};

module.exports = Metadata;
