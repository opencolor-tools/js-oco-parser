/* jshint -W097 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColorValue = function () {
  function ColorValue(name, value) {
    _classCallCheck(this, ColorValue);

    this.name = name;
    this.value = value;
    this.parent = null;
    this.type = 'ColorValue';
  }

  _createClass(ColorValue, null, [{
    key: 'fromColorValue',
    value: function fromColorValue(value) {
      var hex = value.match(/^#[0-9a-fA-F]{3,8}$/);
      if (hex) {
        return new ColorValue('rgb', value);
      }
      var space = value.match(/^(\w+)\((.*)\)$/);
      if (space) {
        return new ColorValue(space[1], space[2]);
      }
      throw "Illegal Color Value: " + value;
    }
  }]);

  return ColorValue;
}();

module.exports = ColorValue;
