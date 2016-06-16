/* eslint-env mocha */
'use strict'

import {expect} from 'chai'
import oco from '../src/index'

describe('Manipulating Entries', () => {
  it('should not be possible to give an invalid name', () => {
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')])
    color.name = 'xx.x'
    expect(color.name).to.equal('xxx')
    color.name = 'xx/x'
    expect(color.name).to.equal('xxx')
  })

  it('should be possible to rename', () => {
    var tree = new oco.Entry()
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')])
    tree.addChild(color)
    tree.get('one').rename('two')
    expect(tree.get('two')).to.equal(color)
  })

  it('should be possible to move Color Entry', () => {
    var tree = new oco.Entry()
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')])
    tree.addChild(color)
    tree.get('one').moveTo('not-one')
    expect(tree.get('not-one')).to.equal(color)
    expect(tree.get('one')).to.be.undefined
  })

  it('should be possible to move Reference Entry', () => {
    var tree = new oco.Entry()
    var reference = new oco.Reference('one', '=notResolvable')
    tree.addChild(reference)
    tree.get('one').moveTo('not-one')
    expect(tree.get('not-one')).to.equal(reference)
    expect(tree.get('one')).to.be.undefined
  })

  it('should be possible to move entries in sub-palettes', () => {
    var tree = new oco.Entry()
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')])
    tree.set('groupA.one', color)
    tree.get('groupA.one').moveTo('groupB.one')
    expect(tree.get('groupB.one')).to.equal(color)
    expect(tree.get('groupA.one')).to.be.undefined
  })

  it('should maintain references', () => {
    var tree = new oco.Entry()
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')])
    var reference = new oco.Reference('oneRef', 'one')

    tree.addChild(color)
    tree.addChild(reference)
    tree.get('one').moveTo('two', true)
    expect(tree.get('oneRef').refName).to.equal('two')
  })

  it('should maintain references in groups', () => {
    var tree = new oco.Entry()
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')])
    var reference = new oco.Reference('oneRef', 'one')

    tree.set('groupA.one', color)
    tree.set('groupA.oneRef', reference)
    tree.get('groupA.one').moveTo('groupB.one', true)
    expect(tree.get('groupA.oneRef').refName).to.equal('groupB.one')
  })

  it('should maintain references when sub-palette name changes', () => {
    var tree = new oco.Entry()
    var color = new oco.Entry('one', [oco.ColorValue.fromColorValue('#111111')])
    var reference = new oco.Reference('oneRef', 'groupA.one')

    tree.set('groupA.one', color)
    tree.set('groupB.oneRef', reference)
    tree.get('groupA').moveTo('groupa - renamed', true)
    expect(tree.get('groupB.oneRef').refName).to.equal('groupa - renamed.one')
  })
})
