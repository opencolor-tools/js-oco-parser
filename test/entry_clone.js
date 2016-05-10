/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');
var Entry = oco.Entry;
var ColorValue = oco.ColorValue;

describe('Cloning Entries', () => {

  it("should be a different object", () => {
    var source = new Entry();
    var clone = source.clone();
    expect(source).to.not.equal(clone);

    // crosscheck test
    var copy = source;
    expect(source).to.equal(copy);
  });

  it("should contain different child objects", () => {
    var source = new Entry();
    var value = new oco.ColorValue.fromColorValue('#ffe');
    var color = new oco.Entry('first', [value], 'Color');
    source.addChild(color);

    var clone = source.clone();
    expect(source.get('first')).to.not.equal(clone.get('first'));

    // crosscheck test
    var copy = source;
    expect(source.get('first')).to.equal(copy.get('first'));
  });

  it("should maintain its own properties", () => {
    var root = new Entry();
    var value = new oco.ColorValue.fromColorValue('#ffe');
    var color = new oco.Entry('first', [value], 'Color');
    root.addChild(color);

    var clone = root.clone();
    clone.name = 'Copy';
    var color2 = new oco.Entry('second', [value], 'Color');
    clone.addChild(color2);

    expect(root.name).to.equal('Root');
    expect(root.children).to.have.length(1);
    expect(clone.name).to.equal('Copy');
    expect(clone.children).to.have.length(2);
  });

});
