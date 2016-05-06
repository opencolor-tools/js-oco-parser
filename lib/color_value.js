/* jshint -W097 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tinycolor = require('tinycolor2');
var ParserError = require('./parser_error');

var ColorValue = function () {
  function ColorValue(name, value) {
    var identified = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, ColorValue);

    this.name = name;
    this.value = value;
    this.parent = null;
    this.type = 'ColorValue';
    this.identified = identified;
  }

  _createClass(ColorValue, [{
    key: 'hexcolor',
    value: function hexcolor() {
      var withAlpha = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (this.identified) {
        if (withAlpha) {
          return this.value.toString('hex8');
        }
        return this.value.toString('hex6');
      }
      return null;
    }
  }], [{
    key: 'fromColorValue',
    value: function fromColorValue(value) {
      var parsed = tinycolor(value);
      if (parsed.isValid()) {
        return new ColorValue(parsed.getFormat(), parsed, true);
      }
      var space = value.match(/^(\w+)\((.*)\)$/);
      if (space) {
        return new ColorValue(space[1], space[0], false);
      }
      throw new ParserError('Illegal Color Value: ' + value, {});
    }
  }]);

  return ColorValue;
}();

module.exports = ColorValue;
