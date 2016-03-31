/* jshint -W097 */
'use strict';
var expect = require('chai').expect;

var parser = require('../lib/index.js');

describe("Basic error handling in Parser", () => {
  it("should raise exception on illegal nesting of colors and colorvalues", () =>  {
    var test = `
block:
  color: #fff
  #ccc
`;
    var fn = function() { parser.parse(test);};
    expect(fn).to.throw();
  });

  it("should raise exception on parse error", () =>  {
    var test = `
block:
  color: #fff;
`;
    var fn = function() { parser.parse(test); };
    expect(fn).to.throw();
  });
});
