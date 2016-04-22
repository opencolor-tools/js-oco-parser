var expect = require('chai').expect;

var lexer = require('../lib/lexer.js');

//var fs = require('fs');

function lexNTimes(input, step) {
  lexer.resetWithInput(input);
  var retVal, i;
  for(i=0;i<step;i++) {
    retVal = lexer.lex();
  }
  return retVal;
}

// // test bed
// function lexAll(input) {
//   var out = [];
//   var lex;
//   lexer.resetWithInput(input);
//   do {
//     lex = lexer.lex();
//     out.push(lex);
//   } while(lex);
//   return out;
// }
// var test = "group:\n  color: #ffe\n  // comment";
// console.log(lexAll(test));



describe("oco lexer", () => {
  it('should ignore empty newlines', () => {
    var lex = lexNTimes("\n", 1);
    expect(lex).to.equal('EOF');
  });
  it('should detect newlines', () => {
    var lex = lexNTimes("hello \n", 2);
    expect(lex).to.equal('NEWLINE');
  });
  it('should detect indentation', () => {
    var lex = lexNTimes("  foo", 1);
    expect(lex).to.equal('INDENT');
  });
  it('should detect number', () => {
    var lex = lexNTimes("1234", 1);
    expect(lex).to.equal('NUMBER');
  });
  it('should detect hexnumber', () => {
    var lex = lexNTimes("1af234", 1);
    expect(lex).to.equal('HEXNUMBER');
  });
  it('should detect name', () => {
    var lex = lexNTimes("a word is a word", 1);
    expect(lex).to.equal('NAME');
  });
  it('should detect quoted string', () => {
    var lex = lexNTimes('"quoted string"', 1);
    expect(lex).to.equal('NAME');
    lexer.resetWithInput("");
  });
  it('should detect color value', () => {
    var lex = lexNTimes('RGBA(120,100,20)', 1);
    expect(lex).to.equal('COLORVALUE');
    lexer.resetWithInput("");
  });

});
