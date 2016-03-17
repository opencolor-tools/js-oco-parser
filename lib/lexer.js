var Lexer = require("lex");

var row = 1;
var col = 1;
var indent = [0];


var lexer = module.exports = new Lexer(function (char) {
    throw new Error("Unexpected character at row " + row + ", col " + col + ": " + char);
});

lexer.resetWithInput = function(input) {
  lexer.setInput(input);
  row = 1;
  col = 1;
  indent = [0];
}

lexer.addRule(/\n+/, function (lexeme) {
  col = 1;
  row += lexeme.length;
  return "NEWLINE";
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
        tokens.push("OUTDENT");
        indent.shift();
    }

    if (tokens.length) return tokens;
});


lexer.addRule(/ +/, function (lexeme) {
    col += lexeme.length;
});

lexer.addRule(/([0-9]+(\.?[0-9]*))/, function(lexeme) {
  this.yytext = lexeme;
  col += lexeme.length;
  return "NUMBER";
})

lexer.addRule(/[a-f\d]+/i, function(lexeme) {
  this.yytext = lexeme;
  col += lexeme.length;
  return "HEXNUMBER";
});


lexer.addRule(/\w[\w ]+/, function(lexeme) {
  this.yytext = lexeme;
  col += lexeme.length;
  return "NAME";
})

lexer.addRule(/"(.*)"/, function(lexeme, string) {
  this.yytext = string;
  col += lexeme.length;
  return "STRING";
});

lexer.addRule(/\//, function(lexeme) {
  col++;
  return "/";
})

lexer.addRule(/\./, function(lexeme) {
  col++;
  return ".";
});

lexer.addRule(/\:/, function(lexeme) {
  col++;
  return ":";
});

lexer.addRule(/=/, function(lexeme) {
  col++;
  return "=";
});

lexer.addRule(/\#/, function(lexeme) {
  col++;
  return "#";
});

lexer.addRule(/\(/, function(lexeme) {
  col ++;
  return "(";
});

lexer.addRule(/\)/, function(lexeme) {
  col ++;
  return ")";
});

lexer.addRule(/,/, function () {
    col++;
    return ",";
});

// lexer.addRule(/(.+)$/gm, function(lexeme) {
//   this.yytext = lexeme;
//   col += lexeme.length;
//   return "STRING";
// });

lexer.addRule(/$/, function () {
    return "EOF";
});
