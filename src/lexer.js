/* jshint -W097 */
'use strict';
var Lexer = require("lex");

var row = 0;
var col = 0;
var indent = [0];


var lexer = module.exports = new Lexer(function (char) {
    throw new Error("Unexpected character at row " + row + ", col " + col + ": " + char);
});

lexer.resetWithInput = function(input) {
  lexer.setInput(input);
  row = 0;
  col = 0;
  indent = [0];
};

function addLocation(obj, line, loc)  {
  obj.yylineno = line;
  if (typeof loc['first_line'] === 'undefined') { loc.first_line = line; }
  if (typeof loc['last_line'] === 'undefined') { loc.last_line = line; }
  obj.yylloc = loc || {};
}

lexer.addRule(/^([ \t]*)(\n+)/gm, function (lexeme, spaces, breaks) {
  col = 1;
  row += breaks.length;
});

lexer.addRule(/\n+/, function (lexeme) {
  addLocation(this, row, {first_line: row, last_line: row + lexeme.length, first_column: col, last_column: 1});
  col = 1;
  row += lexeme.length;
  return "NEWLINE";
});


lexer.addRule(/^ */gm, function (lexeme) {
    var indentation = lexeme.length;
    addLocation(this, row, {first_column: col, last_column: col + indentation });
    col += indentation;

    if (indentation > indent[0]) {
        indent.unshift(indentation);
        return "INDENT";
    }

    var tokens = [];

    while (indentation < indent[0]) {
        tokens.push("OUTDENT");
        tokens.push("NEWLINE"); // this is to fix a bad conondrum on blocks. a newline gives is a fresh new entry.
        indent.shift();
    }

    if (tokens.length) { return tokens; }
});


lexer.addRule(/ +/, function (lexeme) {
  col += lexeme.length;
});

lexer.addRule(/true/, function(lexeme) {
  addLocation(this, row, { first_column: col, last_column: col + lexeme.length });
  col += lexeme.length;
  return "TRUE";
});

lexer.addRule(/false/, function(lexeme) {
  addLocation(this, row, { first_column: col, last_column: col + lexeme.length });
  col += lexeme.length;
  return "FALSE";
});

lexer.addRule(/([0-9]+(\.?[0-9]*))/, function(lexeme) {
  this.yytext = lexeme;
  addLocation(this, row, { first_column: col, last_column: col + lexeme.length });
  col += lexeme.length;
  return "NUMBER";
});

lexer.addRule(/[a-f\d]{3,8}/i, function(lexeme) {
  addLocation(this, row, { first_column: col, last_column: col + lexeme.length });
  this.yytext = lexeme;
  col += lexeme.length;
  return "HEXNUMBER";
});

lexer.addRule(/[a-zA-Z0-9]+\(.+?\)/, function(lexeme) {
  addLocation(this, row, { first_column: col, last_column: col + lexeme.length });
  this.yytext = lexeme;
  col += lexeme.length;
  return "COLORVALUE";
});

lexer.addRule(/[^\/:.,=#\s]+/, function(lexeme) {
  addLocation(this, row, { first_column: col, last_column: col + lexeme.length });
  this.yytext = lexeme;
  col += lexeme.length;
  return "NAME";
});

lexer.addRule(/\/\/.*$/m, function (lexeme) {
  addLocation(this, row, { first_column: col, last_column: col + lexeme.length });
  col += lexeme.length;
  return "COMMENT";
});

lexer.addRule(/"[^\s]*"/, function(lexeme, string) {
  this.yytext = string;
  addLocation(this, row, { first_column: col, last_column: col + lexeme.length });
  col += lexeme.length;
  return "STRING";
});

lexer.addRule(/\//, function() {
  addLocation(this, row, { first_column: col, last_column: col });
  col++;
  return "/";
});

lexer.addRule(/\./, function() {
  addLocation(this, row, { first_column: col, last_column: col });
  col++;
  return ".";
});

lexer.addRule(/\:/, function() {
  addLocation(this, row, { first_column: col, last_column: col });
  col++;
  return ":";
});

lexer.addRule(/=/, function() {
  addLocation(this, row, { first_column: col, last_column: col });
  col++;
  return "=";
});

lexer.addRule(/\#/, function() {
  addLocation(this, row, { first_column: col, last_column: col });
  col++;
  return "#";
});

lexer.addRule(/\(/, function() {
  addLocation(this, row, { first_column: col, last_column: col });
  col ++;
  return "(";
});

lexer.addRule(/\)/, function() {
  addLocation(this, row, { first_column: col, last_column: col });
  col ++;
  return ")";
});

lexer.addRule(/,/, function () {
  addLocation(this, row, { first_column: col, last_column: col });
    col++;
    return ",";
});

lexer.addRule(/=/, function() {
  addLocation(this, row, { first_column: col, last_column: col });
  col ++;
  return "=";
});

// lexer.addRule(/(.+)$/gm, function(lexeme) {
//   this.yytext = lexeme;
//   col += lexeme.length;
//   return "STRING";
// });

lexer.addRule(/$/, function () {
    addLocation(this, row, { first_column: col, last_column: col });
    var tokens = [];
    while (0 < indent[0]) {
      tokens.push("OUTDENT");
      indent.shift();
    }
    tokens.push("EOF");
    return tokens;
});
