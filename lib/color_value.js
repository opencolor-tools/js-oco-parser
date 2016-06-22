'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

var _parser_error = require('./parser_error');

var _parser_error2 = _interopRequireDefault(_parser_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a color value which can be either an identifiedValue or a freeform value
 */

var ColorValue = function () {
  /**
   * @param {string} name of the color space
   * @param {string} color value (unparsed)
   * @param {tinycolor} [identifiedValue] A tinycolor identified color value
   */

  function ColorValue(name, value) {
    var identifiedValue = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, ColorValue);

    /** @type {string} **/
    this.name = name;
    /** @type {string} **/
    this.value = value;
    /** @type {tinycolor} **/
    this.identifiedValue = identifiedValue;
    this.parent = null;
    /** @type {string} **/
    this.type = 'ColorValue';
  }
  /**
   * Returns an hexcolor if the color is expressable as hexcolor
   * @param {boolean} [withAlpha=false] returns a hexcolor with alphachannel if true
   * @return {?string} hexcolor as string. null if color cannot be expressed as hexcolor
   */


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
    /**
     * Returns true if color can be expressed as a hexcolor
     * @return {boolean} true if color value is expressable as a hex color
     */

  }, {
    key: 'isHexExpressable',
    value: function isHexExpressable() {
      return this.identifiedValue != null;
    }
    /**
     * @ignore
     */

  }, {
    key: 'clone',
    value: function clone() {
      return new ColorValue(this.name, this.value, this.identifiedValue);
    }

    /**
     * Helper to construct a ColorValue by handing over a string
     * @param {string} value A color value as string, in either hex format or COLORSPACE(COLORVALUE) format
     * @param {number} [line] Source line number to create meaningful error message if can't be parsed. (Safe to ignore)
     * @return {ColorValue} A ColorValue instance.
     * @throws {ParserError} If value can't be parsed.
     */

  }], [{
    key: 'fromColorValue',
    value: function fromColorValue(value) {
      var line = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var parsed = (0, _tinycolor2.default)(value);
      if (parsed.isValid()) {
        return new ColorValue(parsed.getFormat(), value, parsed);
      }
      var space = value.match(/^(\w+)\((.*)\)$/);
      if (space) {
        return new ColorValue(space[1], space[0], null);
      }
      throw new _parser_error2.default('Illegal Color Value: ' + value, { line: line });
    }
  }]);

  return ColorValue;
}();

exports.default = ColorValue;
