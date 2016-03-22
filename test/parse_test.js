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
    expect(tree.children[0].value).to.equal('#ff0022');
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
    expect(tree.get('group name').get('yellow').value).to.equal('#ff0000');
  });
  it("should parse a reference", () => {
    var test = "color: #fff\nref color: =color";
    var tree = parser.parse(test);
    // Only simple, same level references for now
    expect(tree.children[1].refName).to.equal('color');
    expect(tree.children[1].reference.value).to.equal('#fff');
  });
  it("should overwrite with last hit on key clashes", () => {
    var test = "color: #fff\ncolor: #000\n";
    var tree = parser.parse(test);
    expect(tree.get('color').value).to.equal('#000');
  });
});

describe("Parsing a more complex document", () => {
  it("should parse a single color", () => {
    var input = fs.readFileSync('test/fixtures/test.oco');
    var tree = parser.parse(input);
    // basically just one assertion to verify the parsing worked.
    expect(tree.children[0].get('yellow').value).to.equal('#c01016');
  });
});
