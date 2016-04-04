/* jshint -W097 */
'use strict';

class ColorValue {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.parent = null;
    this.type = 'ColorValue';
  }
}

module.exports = ColorValue;
