/* jshint -W097 */
'use strict';

var jisonparser = require("./oco-parser").parser;
var Entry = require('./entry');
var ColorValue = require('./color_value');
var Reference = require('./reference');
var Metadata = require('./metadata');
var Renderer = require('./renderer');
var lexer = require('./lexer');
var ParserError = require('./parser_error');
jisonparser.lexer = lexer;

jisonparser.yy = {
  ColorValue: ColorValue,
  Entry: Entry,
  Metadata: Metadata,
  Reference: Reference,
  parseError: function parseError(str, hash) {
    throw new ParserError(str, hash);
  },

  log: function log(object) {
    console.log(JSON.stringify(object, false, ' '));
  }
};

var parser = {
  parse: function parse(data, referenceResolver) {
    jisonparser.lexer.resetWithInput(""); //resetting the lexer. Not needed in prod, but helps testing.
    var tree = jisonparser.parse(data);
    tree.referenceResolver = referenceResolver;
    return tree;
  },
  render: function render(tree) {
    return new Renderer(tree).render();
  },

  Entry: Entry,
  ColorValue: ColorValue,
  Reference: Reference,
  Metadata: Metadata
};

module.exports = parser;
