/* jshint -W097 */
/* jshint expr: true */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');

describe('Manipulating Entries', () => {

  it("should be possible to move Color Entry", () => {
    var tree = new oco.Entry();
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')]);
    tree.addChild(color);
    tree.get('one').moveTo('not-one');
    expect(tree.get('not-one')).to.equal(color);
    expect(tree.get('one')).to.be.undefined;
  });

  it("should be possible to move Reference Entry", () => {
    var tree = new oco.Entry();
    var reference = new oco.Reference('one', '=notResolvable');
    tree.addChild(reference);
    tree.get('one').moveTo('not-one');
    expect(tree.get('not-one')).to.equal(reference);
    expect(tree.get('one')).to.be.undefined;
  });

  it("should be possible to move entries in sub-palettes", () => {
    var tree = new oco.Entry();
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')]);
    tree.set('groupA.one', color);
    tree.get('groupA.one').moveTo('groupB.one');
    expect(tree.get('groupB.one')).to.equal(color);
    // expect(tree.get('groupA')).to.be.undefined;
    expect(tree.get('groupA.one')).to.be.undefined;
  });

  it("should maintain references", () => {
    var tree = new oco.Entry();
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')]);
    var reference = new oco.Reference('oneRef', 'one');

    tree.addChild(color);
    tree.addChild(reference);
    tree.get('one').moveTo('two', true);
    expect(tree.get('oneRef').refName).to.equal('two');
  });

  it("should maintain references in groups", () => {
    var tree = new oco.Entry();
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')]);
    var reference = new oco.Reference('oneRef', 'one');

    tree.set('groupA.one', color);
    tree.set('groupA.oneRef', reference);
    tree.get('groupA.one').moveTo('groupB.one', true);
    expect(tree.get('groupA.oneRef').refName).to.equal('groupB.one');
  });

});
