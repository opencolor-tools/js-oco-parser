/* jshint -W097 */
'use strict';

var tinycolor = require('tinycolor2');
var ParserError = require('./parser_error');

class ColorValue {
  constructor(name, value, identified = false) {
    this.name = name;
    this.value = value;
    this.parent = null;
    this.type = 'ColorValue';
    this.identified = identified;
  }
  hexcolor(withAlpha = false) {
    if (this.identified) {
      if (withAlpha) {
        return this.value.toString('hex8').toUpperCase();
      }
      return this.value.toString('hex6').toUpperCase();
    }
    return null;
  }

  clone() {
    return new ColorValue(this.name, this.value, this.identified);
  }

  static fromColorValue(value) {
    var parsed = tinycolor(value);
    if (parsed.isValid()) {
      return new ColorValue(parsed.getFormat(), parsed, true);
    }
    var space = value.match(/^(\w+)\((.*)\)$/);
    if (space) {
      return new ColorValue(space[1], space[0], false);
    }
    throw(new ParserError('Illegal Color Value: ' + value, {}));
  }
}


module.exports = ColorValue;
