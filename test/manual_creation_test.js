/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');

describe('Manually creating OCO objects', () => {
  it("should create a root palette", () => {
    var root = new oco.Entry();
    expect(root.type).to.equal('Root');
    expect(root.name).to.equal('Root');
  });
  it("is possible to create more than one entry with sharing one dotpath", () => {
    var root = new oco.Entry();
    var colorA = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')]);
    var colorB = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')]);
    root.addChild(colorA);
    root.addChild(colorB);
    expect(root.children).to.have.length(2);
  });
});

describe('Manually manipulating OCO objects', () => {
  it("should be able to remove entries", () => {
    var root = new oco.Entry();
    var color = new oco.Entry('colorname', [oco.ColorValue.fromColorValue('#FF0')]);
    root.addChild(color);
    expect(root.children).to.have.length(1);
    root.removeChild(color);
    expect(root.children).to.have.length(0);
  });
  it("should be able to remove colors with dotpath", () => {
    var root = new oco.Entry();
    var color = new oco.Entry('colorname', [oco.ColorValue.fromColorValue('#FF0')]);
    root.addChild(color);
    expect(root.children).to.have.length(1);
    root.remove('colorname');
    expect(root.children).to.have.length(0);
  });
  it("should be able to remove all colors with same dotpath", () => {
    var root = new oco.Entry();
    var colorA = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')]);
    var colorB = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')]);
    root.addChild(colorA);
    root.addChild(colorB);
    expect(root.children).to.have.length(2);
    root.remove('color');
    expect(root.children).to.have.length(0);
  });
  it("should be able to remove palettes with dotpath", () => {
    var root = new oco.Entry();
    var color = new oco.Entry('colorname', [oco.ColorValue.fromColorValue('#FF0')]);
    root.set('foo.bar.colorname', color);
    expect(root.children).to.have.length(1);
    expect(root.get('foo.bar').children).to.have.length(1);
    root.remove('foo');
    expect(root.children).to.have.length(0);
  });
});

describe('Deep creating syntax', () => {
  it("should create an entry structure", () => {
    var root = new oco.Entry();
    var color = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')]);
    expect(color.type).to.equal('Color');
    root.set('foo.bar.baz.color', color);
    expect(root.get('foo').get('bar').get('baz').get('color').get('hex').hexcolor()).to.equal('#FFFF00');
  });
  it("should overwrite entry name", () => {
    var root = new oco.Entry();
    var color = new oco.Entry('entryname', [oco.ColorValue.fromColorValue('#FF0')]);
    expect(color.type).to.equal('Color');
    root.set('newentryname', color);
    expect(root.get('newentryname').name).to.equal('newentryname');
  });
});
