/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var fs = require("fs");

var parser = require('../lib/index.js');

describe("Parser", () => {
  it("should parse a single color", () => {
    var test = "color: #ff0022\n";
    var tree = parser.parse(test);
    expect(tree.name).to.equal('root');
    expect(tree.get('color').type).to.equal('Color');
    expect(tree.get('color').get('rgb').value).to.equal('#ff0022');
  });

  it("should parse a single color as an rgb value", () => {
    var test = "color: rgb(10,20,30)\n";
    var tree = parser.parse(test);
    expect(tree.name).to.equal('root');
    expect(tree.get('color').get('rgb').value).to.equal('10,20,30');
  });

  it("should parse a single color as an special value", () => {
    var test = "color: RAL(1003)\n";
    var tree = parser.parse(test);
    expect(tree.name).to.equal('root');
    expect(tree.get('color').get('RAL').value).to.equal('1003');
  });

  it("should parse a single color with umlaut", () => {
    var test = "Hintergrund Primär: #FFFFFF\n";
    var tree = parser.parse(test);
    expect(tree.get('Hintergrund Primär').get('rgb').value).to.equal('#FFFFFF');
  });

  it("should parse a single color with special chars", () => {
    var test = "Google+: #C52E10\n";
    var tree = parser.parse(test);
    expect(tree.get('Google+').get('rgb').value).to.equal('#C52E10');
  });

  it("should parse a single color given as block", () => {
    var test = `
color:
  #ff0022
`;
    var tree = parser.parse(test);
    expect(tree.constructor.name).to.equal('Block');
    expect(tree.name).to.equal('root');
    expect(tree.get('color').type).to.equal('Color');
    expect(tree.get('color').get('rgb').value).to.equal('#ff0022');
  });

  it("should parse a simple group", () => {
    var test = `
group name:
  yellow: #ff0000
`;
    var tree = parser.parse(test);
    expect(tree.get('group name').get('yellow').get('rgb').value).to.equal('#ff0000');
  });

  it("should parse a simple group with more than one color", () => {
    var test = `
group name:
  yellow: #ff0000
  green: #0f0
`;
    var tree = parser.parse(test);
    expect(tree.get('group name').get('yellow').get('rgb').value).to.equal('#ff0000');
    expect(tree.get('group name').get('green').get('rgb').value).to.equal('#0f0');
  });

  it("should parse a reference", () => {
    var test = `
color: #fff
ref color: =color
`;
    var tree = parser.parse(test);
    // Only simple, same level references for now
    expect(tree.children[1].refName).to.equal('color');
    expect(tree.children[1].reference.get('rgb').value).to.equal('#fff');
  });

  it("should parse a deep reference", () => {
    var test = `
color: #fff
group:
  group color: #aea
  ref color: =color
another color: #fff
`;
    var tree = parser.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('group').get('ref color');
    expect(refColor.refName).to.equal('color');
    expect(refColor.reference.get('rgb').value).to.equal('#fff');
  });
  it("should parse a tree reference", () => {
    var test = `
color: #fff
group:
  group color: #aea
  ref color: =group.another color
  another color: #afa
`;
    var tree = parser.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('group').get('ref color');
    expect(refColor.refName).to.equal('group.another color');
    expect(refColor.reference.get('rgb').value).to.equal('#afa');
  });
  it("should parse a non obvious tree reference", () => {
    var test = `
a:
  b: #fff
  a:
    c: #afa
    subgroup ref color: =a.b
`;
    var tree = parser.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('a').get('a').get('subgroup ref color');
    expect(refColor.refName).to.equal('a.b');
    expect(refColor.reference.get('rgb').value).to.equal('#fff');
  });

  it("should overwrite with last hit on key clashes", () => {
    var test = `
color: #fff
color: #000
`;
    var tree = parser.parse(test);
    expect(tree.get('color').get('rgb').value).to.equal('#000');
  });

  it('a child should know its parents', () => {
    var test = "color: #fff\n";
    var tree = parser.parse(test);
    expect(tree.get('color').parent).to.equal(tree);
  });

  it('should parse with newlines in front', () => {
    var test = "\n\ncolor: #fff\n";
    var tree = parser.parse(test);
    expect(tree.get('color').get('rgb').value).to.equal('#fff');
  });

  it('should parse with newline in front', () => {
    var test = "\ncolor: #fff\n";
    var tree = parser.parse(test);
    expect(tree.get('color').get('rgb').value).to.equal('#fff');
  });
});

describe("Parser access methods", () => {
  it("should allow for dual access via index and key", () => {
    var test = "color: #fff\n";
    var tree = parser.parse(test);
    expect(tree.get(0).get('rgb').value).to.equal('#fff');
    expect(tree.get('color').get('rgb').value).to.equal('#fff');
  });

  it("should allow to forEach directly on the palette", () => {
    var test = `
color a: #fff
color b: #000
`;
    var tree = parser.parse(test);
    var i = 0;
    tree.forEach((color) => {
      expect(color.constructor.name).to.equal('Block');
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
    expect(tree.children[0].get('yellow').get('rgb').value).to.equal('#c01016');
  });
});
