/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');
var Entry = oco.Entry;
var ColorValue = oco.ColorValue;

describe('Entry', () => {
  it("should create a root palette when called without arguments", () => {
    var root = new oco.Entry();
    expect(root.type).to.equal('Root');
    expect(root.name).to.equal('Root');
  });

  it("should throw error when entry and color value are added as children", () => {
    var root = new Entry();
    root.addChild(new Entry('name', [], 'Entry'));
    var fun = function() {
      root.addChild(ColorValue.fromColorValue('#ffe'), true);
    };
    //console.log(root);
    expect(fun).to.throw();
  });

  it("should throw error when entry and color value are added as children", () => {
    var root = new Entry();
    root.addChild(new Entry('name', [], 'Entry'));
    var fun = function() {
      root.addChild(ColorValue.fromColorValue('#ffe'), true);
    };
    //console.log(root);
    expect(fun).to.throw();
  });

  it("adding metadata via object literals", () => {
    var root = new Entry();
    root.addMetadata({'foo/test': 'Hello!'});
    expect(root.metadata['foo/test']).to.equal('Hello!');
  });
  it("adding metadata via object literals with reference", () => {
    var root = new Entry();
    var color = new Entry('super', [ColorValue.fromColorValue('#ffe')], 'Color');
    root.addChild(color);
    root.addMetadata({'foo/test': '=super'});
    expect(root.metadata['foo/test'].resolved().get('rgb').value).to.equal('#ffe');
  });
  it("adding metadata via object literals with hex color", () => {
    var root = new Entry();
    root.addMetadata({'foo/test': '#ffe'});
    expect(root.metadata['foo/test'].value).to.equal('#ffe');
  });
  it("adding metadata via object literals with rgb color", () => {
    var root = new Entry();
    root.addMetadata({'foo/test': 'rgb(123,132,142)'});
    expect(root.metadata['foo/test'].value).to.equal('rgb(123,132,142)');
  });
});
