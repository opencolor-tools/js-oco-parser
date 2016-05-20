'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = metaValue;

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

var _color_value = require('./color_value');

var _color_value2 = _interopRequireDefault(_color_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function metaValue(value) {
  /* This is a trick to get rid of circular dependencies between Reference and MetaProxy */

  var newValue = value;
  if (typeof value === 'string') {
    if (value.match(/^=/)) {
      // shortcut for creating references
      var name = value.slice(1).trim();
      newValue = new _reference2.default('metachild', name);
    } else if (value.match(/^#([a-fA-F0-9]){3,8}/) || value.match(/^rgba?\(.*\)$/)) {
      // shortcut for creating colors
      newValue = _color_value2.default.fromColorValue(value);
    } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
      newValue = true;
    } else if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') {
      newValue = false;
    } else if (value.match(/^[0-9\.,]+$/)) {
      var num = parseFloat(value);
      if (!isNaN(num)) {
        newValue = num;
      }
    }
  }
  return newValue;
}
