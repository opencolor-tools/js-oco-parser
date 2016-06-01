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
  parseError(str, hash) {
    throw(new ParserError(str, hash));
  },
  log: (object) => { console.log(JSON.stringify(object, false, ' ')); }
};


var parser = {
  parse(data, referenceResolver) {
    jisonparser.lexer.resetWithInput(""); //resetting the lexer. Not needed in prod, but helps testing.
    var tree = jisonparser.parse(data);
    tree.referenceResolver = referenceResolver;
    return tree;
  },
  render(tree) {
    return new Renderer(tree).render();
  },
  Entry,
  ColorValue,
  Reference,
  Metadata
};


module.exports = parser;
