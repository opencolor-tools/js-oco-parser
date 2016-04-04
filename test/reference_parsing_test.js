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
    var tree = oco.parse(test);
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
    var tree = oco.parse(test);
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
    var tree = oco.parse(test);
    // Only simple, same level references for now
    var refColor = tree.get('a').get('a').get('subgroup ref color');
    expect(refColor.refName).to.equal('a.b');
    expect(refColor.reference.get('rgb').value).to.equal('#fff');
  });

  it("should resolve references of references", () => {
    var test = `
a: =b
b: =c
c: #afa
`;

    var tree = oco.parse(test);
    // Only simple, same level references for now
    expect(tree.get('a').resolved().get('rgb').value).to.equal('#afa');

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

});
