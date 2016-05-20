'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reference = exports.ColorValue = exports.Entry = exports.parse = exports.render = undefined;

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _entry = require('./entry');

var _entry2 = _interopRequireDefault(_entry);

var _color_value = require('./color_value');

var _color_value2 = _interopRequireDefault(_color_value);

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(data) {
  return (0, _parser2.default)(data.toString());
}
function render(tree) {
  return new _renderer2.default(tree).render();
}

exports.render = render;
exports.parse = parse;
exports.Entry = _entry2.default;
exports.ColorValue = _color_value2.default;
exports.Reference = _reference2.default;
