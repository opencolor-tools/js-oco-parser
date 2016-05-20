/* eslint-env mocha */
'use strict'

import {expect} from 'chai'
import {Entry, ColorValue, Reference} from '../src/index'

describe('Cloning Entries', () => {
  it('should be a different object', () => {
    var source = new Entry()
    var clone = source.clone()
    expect(source).to.not.equal(clone)

    // crosscheck test
    var copy = source
    expect(source).to.equal(copy)
  })

  it('should contain different child objects', () => {
    var source = new Entry()
    var value = ColorValue.fromColorValue('#ffe')
    var color = new Entry('first', [value], 'Color')
    source.addChild(color)

    var clone = source.clone()
    expect(source.get('first')).to.not.equal(clone.get('first'))

    // crosscheck test
    var copy = source
    expect(source.get('first')).to.equal(copy.get('first'))
  })

  it('should maintain its own properties', () => {
    var root = new Entry()
    var value = ColorValue.fromColorValue('#ffe')
    var color = new Entry('first', [value], 'Color')
    root.addChild(color)

    var clone = root.clone()
    clone.name = 'Copy'
    var color2 = new Entry('second', [value], 'Color')
    clone.addChild(color2)

    expect(root.name).to.equal('Root')
    expect(root.children).to.have.length(1)
    expect(clone.name).to.equal('Copy')
    expect(clone.children).to.have.length(2)
  })

  it('should clone metadata', () => {
    var root = new Entry()
    var palette = new Entry('first', [], 'Palette')
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

  it('should clone references', () => {
    var root = new Entry()
    var value = ColorValue.fromColorValue('#111111')
    var color = new Entry('one', [value], 'Color')

    var reference = new Reference('oneRef', 'one')
    root.addChild(color)
    root.addChild(reference)

    var clone = root.clone()
    clone.name = 'Copy'

    expect(root.name).to.equal('Root')
    expect(clone.get('oneRef').type).to.equal('Reference')
    expect(clone.get('oneRef').resolved().hexcolor()).to.equal('#111111')
  })
})
