var should = require('chai').should()

var lexer = require('../lib/lexer.js');

describe("super simple lexing", () => {
  it("should have lexed something", () => {
    var input = "a group:\n  some/metadata: \"I'm a string\"\n  other/meta data: I'm the rest of it.\n  yellow: #ff0\n";
    console.log(input);
    lexer.input = input;
    lex = null;
    do {
      lex = lexer.lex();
      console.log(lex);
    } while(lex)

  })
});
