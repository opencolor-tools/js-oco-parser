/* eslint-env mocha */
'use strict'

import {expect} from 'chai'
import * as oco from '../src/index'

/** @test {Entry#clone} */
describe('Cloning Entries', () => {
  /** @test {Entry#clone} */
  it('should be a different object', () => {
    var source = new oco.Entry()
    var clone = source.clone()
    expect(source).to.not.equal(clone)

    // crosscheck test
    var copy = source
    expect(source).to.equal(copy)
  })

  /** @test {Entry#clone} */
  it('should contain different child objects', () => {
    var source = new oco.Entry()
    var value = oco.ColorValue.fromColorValue('#ffe')
    var color = new oco.Entry('first', [value], 'Color')
    source.addChild(color)

    var clone = source.clone()
    expect(source.get('first')).to.not.equal(clone.get('first'))

    // crosscheck test
    var copy = source
    expect(source.get('first')).to.equal(copy.get('first'))
  })

  /** @test {Entry#clone} */
  it('should maintain its own properties', () => {
    var root = new oco.Entry()
    var value = oco.ColorValue.fromColorValue('#ffe')
    var color = new oco.Entry('first', [value], 'Color')
    root.addChild(color)

    var clone = root.clone()
    clone.name = 'Copy'
    var color2 = new oco.Entry('second', [value], 'Color')
    clone.addChild(color2)

    expect(root.name).to.equal('Root')
    expect(root.children).to.have.length(1)
    expect(clone.name).to.equal('Copy')
    expect(clone.children).to.have.length(2)
  })

  /** @test {Entry#clone} */
  it('should clone metadata', () => {
    var root = new oco.Entry()
    var palette = new oco.Entry('first', [], 'Palette')
    palette.addMetadata({
      'oct/defaultView': 'squares',
      'oct/color': '#000000',
      'oct/ref': '=first'
    })
    root.addChild(palette)

    var clone = root.clone()
    clone.name = 'Copy'

    expect(root.name).to.equal('Root')
    expect(root.get('first').type).to.equal('Palette')
    expect(clone.name).to.equal('Copy')
    expect(clone.get('first').type).to.equal('Palette')
    expect(clone.get('first').metadata.keys()).to.deep.equal(['oct/defaultView', 'oct/color', 'oct/ref'])
    expect(clone.get('first').metadata.get('oct/color').type).to.equal('ColorValue')
    expect(clone.get('first').metadata.get('oct/ref').type).to.equal('Reference')
  })

  /** @test {Reference#clone} */
  it('should clone references', () => {
    var root = new oco.Entry()
    var value = oco.ColorValue.fromColorValue('#111111')
    var color = new oco.Entry('one', [value], 'Color')

    var reference = new oco.Reference('oneRef', 'one')
    root.addChild(color)
    root.addChild(reference)

    var clone = root.clone()
    clone.name = 'Copy'

    expect(root.name).to.equal('Root')
    expect(clone.get('oneRef').type).to.equal('Reference')
    expect(clone.get('oneRef').resolved().hexcolor()).to.equal('#111111')
  })
})
