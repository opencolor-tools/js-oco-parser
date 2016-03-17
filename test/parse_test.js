var should = require('chai').should()
var fs = require("fs");

var parser = require('../lib/index.js');

describe("Test", () => {
  it("should parse", () => {
    var test = fs.readFileSync("test/fixtures/test.oco", "utf8");
    var tree = parser.parse(test);

    console.log(JSON.stringify(tree, null, '\t'));
  })
});
