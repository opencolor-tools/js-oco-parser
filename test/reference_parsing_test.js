/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');

describe("Parsing of References", () => {
  it("should parse a reference", () => {
    var test = `
color: #fff
ref color: =color
`;
    var tree = oco.parse(test);
    // Only simple, same level references for now
    expect(tree.children[1].refName).to.equal('color');
    expect(tree.children[1].resolved().hexcolor()).to.equal('#FFFFFF');
  });

  it("should parse a deep reference", () => {
    var test = `
color: #fff
group:
  group color: #aea
  ref color: =color
  test: #000
another color: #ffe`;
    var tree = oco.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('group').get('ref color');
    expect(refColor.refName).to.equal('color');
    expect(refColor.resolved().hexcolor()).to.equal('#FFFFFF');
  });

  it("should return a absolute ref name", () => {
    var test = `
one: #111111
three: #333333
group:
  one: #111111
  two: #222222
  refOne: =one
  refTwo: =group.two
  refThree: =three
  refThreeRef: =refThree
`;
    var tree = oco.parse(test);
    var refOne = tree.get('group').get('refOne');
    var refTwo = tree.get('group').get('refTwo');
    var refThree = tree.get('group').get('refThree');
    var refThreeRef = tree.get('group').get('refThreeRef');
    expect(refOne.absoluteRefName).to.equal('group.one');
    expect(refTwo.absoluteRefName).to.equal('group.two');
    expect(refThree.absoluteRefName).to.equal('three');
    expect(refThreeRef.absoluteRefName).to.equal('group.refThree');
  });

  it("should parse a tree reference", () => {
    var test = `
color: #fff
group:
  group color: #aea
  ref color: =group.another color
  another color: #afa
`;
    var tree = oco.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('group').get('ref color');
    expect(refColor.refName).to.equal('group.another color');
    expect(refColor.resolved().hexcolor()).to.equal('#AAFFAA');
  });

  it("should parse a non obvious tree reference", () => {
    var test = `
a:
  b: #fff
  a:
    c: #afa
    subgroup ref color: =a.b
`;
    var tree = oco.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('a').get('a').get('subgroup ref color');
    expect(refColor.refName).to.equal('a.b');
    expect(refColor.resolved().hexcolor()).to.equal('#FFFFFF');
  });

  it("should resolve references of references", () => {
    var test = `
a: =b
b: =c
c: #afa
`;

    var tree = oco.parse(test);
    // Only simple, same level references for now
    expect(tree.get('a').resolved().hexcolor()).to.equal('#AAFFAA');

  });

  it("should break on resolving single circular references", () => {
    var test = `
a: =b
b: =a
`;
    var tree = oco.parse(test);
    // Only simple, same level references for now
    expect(tree.get('a').resolved).to.throw();
  });

  it("should break on resolving multi circular references", () => {
    var test = `
a: =b
b: =c
c: =a
`;
    var tree = oco.parse(test);
    // Only simple, same level references for now
    expect(tree.get('a').resolved).to.throw();
  });

  it("should resolve references with number names", () => {
    var test = `
800: #cc0000
a: =800
`;
    var tree = oco.parse(test);
    // Only simple, same level references for now
    expect(tree.get('a').resolved().hexcolor()).to.equal('#CC0000');
  });

});
