/* jshint -W097 */
'use strict';

var Lexer = require("lex");

var row = 1;
var col = 1;
var indent = [0];

var lexer = module.exports = new Lexer(function (char) {
  throw new Error("Unexpected character at row " + row + ", col " + col + ": " + char);
});

lexer.resetWithInput = function (input) {
  lexer.setInput(input);
  row = 1;
  col = 1;
  indent = [0];
};

function addLocation(obj, line) {
  obj.yylineno = line;
}

lexer.addRule(/^( \t)*\n/gm, function () {
  col = 1;
  row += 1;
});

lexer.addRule(/\n+/, function (lexeme) {
  addLocation(this, row);
  col = 1;
  row += lexeme.length;
  return "NEWLINE";
});

lexer.addRule(/^ */gm, function (lexeme) {
  var indentation = lexeme.length;
  addLocation(this, row);
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

  if (tokens.length) {
    return tokens;
  }
});

lexer.addRule(/ +/, function (lexeme) {
  col += lexeme.length;
});

lexer.addRule(/true/, function (lexeme) {
  addLocation(this, row);
  col += lexeme.length;
  return "TRUE";
});

lexer.addRule(/false/, function (lexeme) {
  addLocation(this, row);
  col += lexeme.length;
  return "FALSE";
});

lexer.addRule(/([0-9]+(\.?[0-9]*))/, function (lexeme) {
  this.yytext = lexeme;
  addLocation(this, row);
  col += lexeme.length;
  return "NUMBER";
});

lexer.addRule(/[a-f\d]{3,8}/i, function (lexeme) {
  addLocation(this, row);
  this.yytext = lexeme;
  col += lexeme.length;
  return "HEXNUMBER";
});

lexer.addRule(/[^\/:.,=#()\s][^\/:.,=#()\s]*/, function (lexeme) {
  addLocation(this, row);
  this.yytext = lexeme;
  col += lexeme.length;
  return "NAME";
});

lexer.addRule(/\/\//, function () {
  addLocation(this, row);
  col++;
  return "COMMENTSTART";
});

lexer.addRule(/"[^\s]*"/, function (lexeme, string) {
  this.yytext = string;
  addLocation(this, row);
  col += lexeme.length;
  return "STRING";
});

lexer.addRule(/\//, function () {
  addLocation(this, row);
  col++;
  return "/";
});

lexer.addRule(/\./, function () {
  addLocation(this, row);
  col++;
  return ".";
});

lexer.addRule(/\:/, function () {
  addLocation(this, row);
  col++;
  return ":";
});

lexer.addRule(/=/, function () {
  addLocation(this, row);
  col++;
  return "=";
});

lexer.addRule(/\#/, function () {
  addLocation(this, row);
  col++;
  return "#";
});

lexer.addRule(/\(/, function () {
  addLocation(this, row);
  col++;
  return "(";
});

lexer.addRule(/\)/, function () {
  addLocation(this, row);
  col++;
  return ")";
});

lexer.addRule(/,/, function () {
  addLocation(this, row);
  col++;
  return ",";
});

lexer.addRule(/=/, function () {
  addLocation(this, row);
  col++;
  return "=";
});

// lexer.addRule(/(.+)$/gm, function(lexeme) {
//   this.yytext = lexeme;
//   col += lexeme.length;
//   return "STRING";
// });

lexer.addRule(/$/, function () {
  addLocation(this, row);
  return "EOF";
});
