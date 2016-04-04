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

});
