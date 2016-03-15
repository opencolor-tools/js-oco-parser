var should = require('chai').should()

var Parser = require('../lib/index.js');

describe("Test", () => {
  it("should return a string", () => {
    console.log(Parser, new Parser())
    new Parser().parse("foo").should.be.a('string');
  })
});
