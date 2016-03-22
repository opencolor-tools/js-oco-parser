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
  it("should parse a simple group with more than one color", () => {
    var test = "group name: \n  yellow: #ff0000\n  green: #0f0\n";
    var tree = parser.parse(test);
    expect(tree.get('group name').get('yellow').value).to.equal('#ff0000');
    expect(tree.get('group name').get('green').value).to.equal('#0f0');
  });
  it("should parse a reference", () => {
    var test = "color: #fff\nref color: =color\n";
    var tree = parser.parse(test);
    // Only simple, same level references for now
    expect(tree.children[1].refName).to.equal('color');
    expect(tree.children[1].reference.value).to.equal('#fff');
  });
  it("should parse a deep reference", () => {
    var test = "color: #fff\ngroup:\n  group color: #aea\n  ref color: =color\nanother color: #fff\n";
    var tree = parser.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('group').get('ref color');
    expect(refColor.refName).to.equal('color');
    expect(refColor.reference.value).to.equal('#fff');
  });
  it("should parse a tree reference", () => {
    var test = "color: #fff\ngroup:\n  group color: #aea\n  ref color: =group.another color\n  another color: #afa\n";
    var tree = parser.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('group').get('ref color');
    expect(refColor.refName).to.equal('group.another color');
    expect(refColor.reference.value).to.equal('#afa');
  });
  it("should parse a non obvious tree reference", () => {
    var test = "a:\n b: #fff\n a:\n  c: #afa\n  subgroup ref color: =a.b\n";
    var tree = parser.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('a').get('a').get('subgroup ref color');
    expect(refColor.refName).to.equal('a.b');
    expect(refColor.reference.value).to.equal('#fff');
  });
  it("should overwrite with last hit on key clashes", () => {
    var test = "color: #fff\ncolor: #000\n";
    var tree = parser.parse(test);
    expect(tree.get('color').value).to.equal('#000');
  });
  it('a child should know its parents', () => {
    var test = "color: #fff\n";
    var tree = parser.parse(test);
    expect(tree.get('color').parent).to.equal(tree);
  });
});

describe("Parser access methods", () => {
  it("should allow for dual access via index and key", () => {
    var test = "color: #fff\n";
    var tree = parser.parse(test);
    expect(tree.get(0).value).to.equal('#fff');
    expect(tree.get('color').value).to.equal('#fff');
  });
  it("should allow to forEach directly on the palette", () => {
    var test = "color a: #fff\ncolor b: #000\n";
    var tree = parser.parse(test);
    var i = 0;
    tree.forEach((color) => {
      expect(color.constructor.name).to.equal('Color');
      i++;
    });
    expect(i).to.equal(2); // make sure that the inner asserts are even called :)
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
