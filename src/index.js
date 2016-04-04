/* jshint -W097 */
'use strict';

var jisonparser = require("./oco-parser").parser;
var Entry = require('./entry');
var ColorValue = require('./color_value');
var Reference = require('./reference');
var Metadata = require('./metadata');
var lexer = require('./lexer');
jisonparser.lexer = lexer;

jisonparser.yy = {
  ColorValue: ColorValue,
  Entry: Entry,
  Metadata: Metadata,
  Reference: Reference,
  parseError: (str) => { throw(str); },
  log: (object) => { console.log(JSON.stringify(object, false, ' ')); }
};


var parser = {
  parse(data) {
    jisonparser.lexer.resetWithInput(""); //resetting the lexer. Not needed in prod, but helps testing.
    var tree = jisonparser.parse(data);
    tree.resolveReferences();
    return tree;
  }
};


module.exports = parser;
