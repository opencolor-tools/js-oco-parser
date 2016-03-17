var should = require('chai').should()

var lexer = require('../lib/lexer.js');
var fs = require("fs");


describe("super simple lexing", () => {
  it("should have lexed something", () => {
    var test = fs.readFileSync("test/fixtures/test.oco", "utf8");
    lexer.input = test;
    lex = null;
    do {
      lex = lexer.lex();
      console.log(lex);
    } while(lex)

  })
});
