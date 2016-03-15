var Lexer = require("lex");

var row = 1;
var col = 1;
var indent = [0];


var lexer = module.exports = new Lexer(function (char) {
    throw new Error("Unexpected character at row " + row + ", col " + col + ": " + char);
});

lexer.addRule(/^ */gm, function (lexeme) {
    var indentation = lexeme.length;

    col += indentation;

    if (indentation > indent[0]) {
        indent.unshift(indentation);
        return "INDENT";
    }

    var tokens = [];

    while (indentation < indent[0]) {
        tokens.push("DEDENT");
        indent.shift();
    }

    if (tokens.length) return tokens;
});

lexer.addRule(/\n+/, function (lexeme) {
  col = 1;
  row += lexeme.length;
  return "NEWLINE";
});

lexer.addRule(/(\w[\w\s]+?): {0,1}/, function(lexeme) {
  this.yytext = +lexeme;
  col += lexeme.length;
  return "NAME";
})

lexer.addRule(/(\w[\w\s\/]+?): {0,1}/, function(lexeme) {
  this.yytext = +lexeme;
  col += lexeme.length;
  return "METADATA";
})

lexer.addRule(/(\d+)/, function(lexeme) {
  this.yytext = +lexeme;
  col += lexeme.length;
  return "NUMBER";
})

lexer.addRule(/"(.*)"/, function(lexeme) {
  this.yytext = +lexeme;
  col += lexeme.length;
  return "STRING";
});

lexer.addRule(/(\#[\da-fA-F]{3,6})/, function(lexeme) {
  this.yytext = +lexeme;
  col += lexeme.length;
  return "HEXCOLOR";
});

lexer.addRule(/(.+)$/gm, function(lexeme) {
  this.yytext = +lexeme;
  col += lexeme.length;
  return "STRING";
});
