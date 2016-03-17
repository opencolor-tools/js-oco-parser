'use strict';
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
  it("should parse a reference", () => {
    var test = "color: #fff\nref color: =color";
    var tree = parser.parse(test);
    // Only simple, same level references for now
    expect(tree.references['ref color'].refName).to.equal('color');
    expect(tree.references['ref color'].reference.value).to.equal('#fff');
  });

});

describe("Parsing a more complex document", () => {
  it("should parse a single color", () => {
    var input = fs.readFileSync('test/fixtures/test.oco');
    var tree = parser.parse(input);
    // basically just one assertion to verify the parsing worked.
    expect(tree.palettes['group'].colors['yellow'].value).to.equal('#c01016');
  });
});
