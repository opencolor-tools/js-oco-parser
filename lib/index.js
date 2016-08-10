'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reference = exports.ColorValue = exports.Entry = undefined;
exports.render = render;
exports.parse = parse;

var _entry = require('./entry');

Object.defineProperty(exports, 'Entry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_entry).default;
  }
});

var _color_value = require('./color_value');

Object.defineProperty(exports, 'ColorValue', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_color_value).default;
  }
});

var _reference = require('./reference');

Object.defineProperty(exports, 'Reference', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_reference).default;
  }
});

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Render an OCO tree into a string
 * @param {Entry} tree OCO Tree
 * @return {string} Rendered OCO
 */
function render(tree) {
  return new _renderer2.default(tree).render();
}

/**
 * Parses a string into an OCO tree
 * @param {string} data String or anything that can be converted to a String with toString()
 * @return {Entry} OCO tree
 * @throws {ParserError} if input is not valid OCO
 */
function parse(data) {
  var urlResolver = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  return (0, _parser2.default)(data.toString(), urlResolver);
}
