var expect = require('chai').expect
var fs = require("fs");

var parser = require('../lib/index.js');

describe("Parser", () => {
  it("should parse a single color", () => {
    var test = "color: #ff0022\n";
    var tree = parser.parse(test);
    expect(tree.constructor.name).to.equal('Palette');
    expect(tree.name).to.equal('root');
    expect(tree.colors['color'].value).to.equal('#ff0022');
  })
  it("should parse metadata", () => {
    var test = "/author: Jan Krutisch\n";
    var tree = parser.parse(test);
    expect(tree.metadata['/author'].value).to.equal('Jan Krutisch');
    var test = "meta/author: Jan Krutisch\n";
    var tree = parser.parse(test);
    expect(tree.metadata['meta/author'].value).to.equal('Jan Krutisch');
  })
  it("should parse a simple group", () => {
    var test = "group name: \n  yellow: #ff0000\n";
    var tree = parser.parse(test);
    expect(tree.palettes['group name'].colors['yellow'].value).to.equal('#ff0000');
  });
});
