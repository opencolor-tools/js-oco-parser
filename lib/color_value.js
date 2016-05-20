/* jshint -W097 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tinycolor = require('tinycolor2');
var ParserError = require('./parser_error');

var ColorValue = function () {
  function ColorValue(name, value) {
    var identifiedValue = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, ColorValue);

    this.name = name;
    this.value = value;
    this.identifiedValue = identifiedValue;
    this.parent = null;
    this.type = 'ColorValue';
  }

  _createClass(ColorValue, [{
    key: 'hexcolor',
    value: function hexcolor() {
      var withAlpha = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (this.isHexExpressable()) {
        if (withAlpha) {
          return this.identifiedValue.toString('hex8').toUpperCase();
        }
        return this.identifiedValue.toString('hex6').toUpperCase();
      }
      return null;
    }
  }, {
    key: 'isHexExpressable',
    value: function isHexExpressable() {
      return this.identifiedValue != null;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new ColorValue(this.name, this.value, this.identifiedValue);
    }
  }], [{
    key: 'fromColorValue',
    value: function fromColorValue(value) {
      var line = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var parsed = tinycolor(value);
      if (parsed.isValid()) {
        return new ColorValue(parsed.getFormat(), value, parsed);
      }
      var space = value.match(/^(\w+)\((.*)\)$/);
      if (space) {
        return new ColorValue(space[1], space[0], null);
      }
      throw new ParserError('Illegal Color Value: ' + value, { line: line });
    }
  }]);

  return ColorValue;
}();

module.exports = ColorValue;
