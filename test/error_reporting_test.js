/* jshint -W097 */
'use strict';
var expect = require('chai').expect;

var parser = require('../lib/index.js');
var ParserError = require('../lib/parser_error.js');

describe("Basic error handling in Parser", () => {
  it("should raise exception on illegal nesting of colors and colorvalues", () =>  {
    var test = `
block:
  color: #fff
  #ccc
`;
    var fn = function() { parser.parse(test);};
    expect(fn).to.throw(ParserError);
  });

  it("should raise exception on parse error", () =>  {
    var test = `
block:
  color: #fff;
`;
    var fn = function() { parser.parse(test); };
    expect(fn).to.throw(ParserError);
  });
  it("should raise exception on parse error", () =>  {
    var test = `
block:
  color: #fff;
`;
    try {
      parser.parse(test);
    } catch(ex) {
      expect(ex.constructor).to.equal(ParserError);
      expect(ex.error.line).to.equal(2);
    }
  });
});
