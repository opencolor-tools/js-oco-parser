/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');

describe('ColorValue', () => {
  it("should create hex value", () => {
    var colorValue = oco.ColorValue.fromColorValue('#ffa');
    expect(colorValue.value).to.equal('#ffa');
    expect(colorValue.name).to.equal('rgb');
  });

  it("should create rgb value", () => {
    var colorValue = oco.ColorValue.fromColorValue('rgb(134,255,234)');
    expect(colorValue.value).to.equal('rgb(134,255,234)');
    expect(colorValue.name).to.equal('rgb');
  });

  it("should create arbitrary value", () => {
    var colorValue = oco.ColorValue.fromColorValue('RAL(1003)');
    expect(colorValue.value).to.equal('RAL(1003)');
    expect(colorValue.name).to.equal('RAL');
  });
});
