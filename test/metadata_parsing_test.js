/* jshint -W097 */
'use strict';
var expect = require('chai').expect;

var parser = require('../lib/index.js');

describe("Parsing Metadata", () => {
  it("should parse metadata", () => {
    var test = "/author: Erykah Badu\n";
    var tree = parser.parse(test);
    expect(tree.metadata['/author'].value).to.equal('Erykah Badu');
    test = "meta/author: Erykah Badu\n";
    tree = parser.parse(test);
    expect(tree.metadata['meta/author'].value).to.equal('Erykah Badu');
  });

  it("should parse metadata Block", () => {
    var test = `
/metadata:
  author: Erykah Badu
`;
    var tree = parser.parse(test);
    expect(tree.metadata['/metadata'].metadata['author'].value).to.equal('Erykah Badu');
  });

  it("should parse metadata Block with a slash a the end of the name", () => {
    var test = `
hello/metadata/:
  author: Erykah Badu
`;
    var tree = parser.parse(test);
    expect(tree.metadata['hello/metadata/'].metadata['author'].value).to.equal('Erykah Badu');
  });

  it("should parse metadata with more than one slash", () => {
    var test = "foo/bar/author: Erykah Badu\n";
    var tree = parser.parse(test);
    expect(tree.metadata['foo/bar/author'].value).to.equal('Erykah Badu');
    test = "/foo/bar/author: Erykah Badu\n";
    tree = parser.parse(test);
    expect(tree.metadata['/foo/bar/author'].value).to.equal('Erykah Badu');
  });

  it("should parse metadata in a color block", () => {
    var test = `
color:
  #123
  author/name: Erykah Badu
`;
    var tree = parser.parse(test);
    expect(tree.get('color').get('rgb').value).to.equal('#123');
    expect(tree.get('color').metadata['author/name'].value).to.equal('Erykah Badu');
  });

  it("should parse metadata in a color block when metadata comes first", () => {
    var test = `
color:
  author/name: Erykah Badu
  #123
`;
    var tree = parser.parse(test);
    expect(tree.get('color').get('rgb').value).to.equal('#123');
    expect(tree.get('color').metadata['author/name'].value).to.equal('Erykah Badu');
  });

  it("should parse metadata in a color block when metadata comes first (twice)", () => {
    var test = `
color:
  author/name: Erykah Badu
  author/email: Erykah Badu
  #123
`;
    var tree = parser.parse(test);
    expect(tree.get('color').get('rgb').value).to.equal('#123');
    expect(tree.get('color').metadata['author/name'].value).to.equal('Erykah Badu');
  });

});
