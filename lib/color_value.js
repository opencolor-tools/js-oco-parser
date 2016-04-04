/* jshint -W097 */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColorValue = function ColorValue(name, value) {
  _classCallCheck(this, ColorValue);

  this.name = name;
  this.value = value;
  this.parent = null;
  this.type = 'ColorValue';
};

module.exports = ColorValue;
