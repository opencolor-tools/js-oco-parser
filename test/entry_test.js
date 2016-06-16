/* eslint-env mocha */
'use strict'

import {expect} from 'chai'
import oco from '../src/index.js'

var Entry = oco.Entry
var ColorValue = oco.ColorValue

describe('Entry', () => {
  it('should create a root palette when called without arguments', () => {
    var root = new oco.Entry()
    expect(root.parent).to.equal(null)
    expect(root.name).to.equal('Root')
  })

  it('should be able to rename', () => {
    var root = new oco.Entry()
    root.name = 'XXX'
    expect(root.name).to.equal('XXX')
  })

  it('should clean name', () => {
    var root = new oco.Entry()
    root.name = 'XX.X'
    expect(root.name).to.equal('XXX')
  })

  it('#toString', () => {
    var root = new oco.Entry()
    root.addChild(new Entry('name', [], 'Color'))
    expect(root.toString()).to.equal(
`{
  "_name": "Root",
  "children": [
    {
      "_name": "name",
      "children": [],
      "parent": "",
      "metadata": {
        "parent": "name",
        "_hash": {},
        "_data": []
      },
      "type": "Color"
    }
  ],
  "parent": null,
  "metadata": {
    "parent": "",
    "_hash": {},
    "_data": []
  },
  "type": "Palette"
}`)
  })

  it('should throw error when entry and color value are added as children', () => {
    var root = new Entry()
    root.addChild(new Entry('name', [], 'Palette'))
    var fun = function () {
      root.addChild(ColorValue.fromColorValue('#FFE'), true)
    }
    expect(fun).to.throw()
  })

  it('should throw error when entry and color value are added as children', () => {
    var root = new Entry()
    root.addChild(new Entry('name', [], 'Palette'))
    var fun = function () {
      root.addChild(ColorValue.fromColorValue('#FFE'), true)
    }
    // console.log(root)
    expect(fun).to.throw()
  })

  it('adding metadata via object literals', () => {
    var root = new Entry()
    root.addMetadata({'foo/test': 'Hello!'})
    expect(root.getMetadata('foo/test')).to.equal('Hello!')
  })

  it('adding metadata via object literals with reference', () => {
    var root = new Entry()
    var color = new Entry('super', [ColorValue.fromColorValue('#FFE')], 'Color')
    root.addChild(color)
    root.addMetadata({'foo/test': '=super'})
    expect(root.getMetadata('foo/test').resolved().get('hex').hexcolor()).to.equal('#FFFFEE')
  })

  it('adding metadata via object literals with hex color', () => {
    var root = new Entry()
    root.addMetadata({'foo/test': '#ffe'})
    expect(root.getMetadata('foo/test').hexcolor()).to.equal('#FFFFEE')
  })

  it('adding metadata via object literals with rgb color', () => {
    var root = new Entry()
    root.addMetadata({'foo/test': 'rgb(123,132,142)'})
    expect(root.getMetadata('foo/test').value).to.equal('rgb(123,132,142)')
  })
})
