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
});

describe('Deep creating syntax', () => {
  it("should create an entry structure", () => {
    var root = new oco.Entry();
    var color = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')]);
    expect(color.type).to.equal('Color');
    root.set('foo.bar.baz.color', color);
    expect(root.get('foo').get('bar').get('baz').get('color').get('hex').hexcolor()).to.equal('#FFFF00');
  });
});
