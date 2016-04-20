/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var fs = require("fs");

var parser = require('../lib/index.js');

describe("Parser", () => {
  it("should parse a single color", () => {
    var test = "color: #ff0022";
    var tree = parser.parse(test);
    expect(tree.name).to.equal('root');
    expect(tree.get('color').type).to.equal('Color');
    expect(tree.get('color').get('rgb').value).to.equal('#ff0022');
  });

  it("should allow numbers as color names", () => {
    var test = "001: #ff0022\n";
    var tree = parser.parse(test);
    expect(tree.name).to.equal('root');
    expect(tree.get('001').type).to.equal('Color');
    expect(tree.get('001').get('rgb').value).to.equal('#ff0022');
  });

  it("should allow hexnumbers as color names", () => {
    var test = "f00: #f00022\n";
    var tree = parser.parse(test);
    expect(tree.name).to.equal('root');
    expect(tree.get('f00').type).to.equal('Color');
    expect(tree.get('f00').get('rgb').value).to.equal('#f00022');
  });

  it("should parse a single color as an rgb value", () => {
    var test = "color: rgb(10,20,30)\n";
    var tree = parser.parse(test);
    expect(tree.name).to.equal('root');
    expect(tree.get('color').get('rgb').value).to.equal('rgb(10,20,30)');
  });

  it("should parse a single color as an special value", () => {
    var test = "color: RAL(1003)\n";
    var tree = parser.parse(test);
    expect(tree.name).to.equal('root');
    expect(tree.get('color').get('RAL').value).to.equal('RAL(1003)');
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
    expect(tree.type).to.equal('Root');
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


  it("should parse a simple group with colors after it", () => {
    var test = `
group name:
  yellow: #ff0000

red: #f00
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

describe("Parsing comments", () => {
  it("should parse single line comments", () => {
    var test = "color: #fff\n// Hello!\n";
    var tree = parser.parse(test);
    expect(tree.get('color').get('rgb').value).to.equal('#fff');
  });
  it("should parse single line comments after block", () => {
    var test = `
group:
  color: #fff
// Hello!
`;
    var tree = parser.parse(test);
    expect(tree.get('group').get('color').get('rgb').value).to.equal('#fff');
  });

  it("should parse same line comments", () => {
    var test = "color: #fff// Hello!\n";
    var tree = parser.parse(test);
    expect(tree.get('color').get('rgb').value).to.equal('#fff');
  });
  it("should parse block lead comments", () => {
    var test = "group: // Hello\n  color: #ffe\n";
    var tree = parser.parse(test);
    expect(tree.get('group').get('color').get('rgb').value).to.equal('#ffe');
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
      expect(color.type).to.equal('Color');
      i++;
    });
    expect(i).to.equal(2); // make sure that the inner asserts are even called :)
  });
});

describe("Parsing a more complex document", () => {
  it("should parse a single color", () => {
    var input = fs.readFileSync('test/fixtures/test_with_comments.oco');
    var tree = parser.parse(input);
    // basically just one assertion to verify the parsing worked.
    expect(tree.children[0].get('yellow').get('rgb').value).to.equal('#c01016');
    expect(tree.get('group').metadata['meta/other/data']).to.equal('Super Cool Metadata');
  });
});
