/* jshint -W097 */
'use strict';

class ColorValue {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.parent = null;
    this.type = 'ColorValue';
  }
  static fromColorValue(value) {
    var hex = value.match(/^#[0-9a-fA-F]{3,8}$/);
    if (hex) {
      return new ColorValue('rgb', value);
    }
    var space = value.match(/^(\w+)\((.*)\)$/);
    if (space) {
      return new ColorValue(space[1], space[2]);
    }
    throw("Illegal Color Value: " + value);
  }
}

module.exports = ColorValue;
