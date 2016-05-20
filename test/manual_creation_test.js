/* eslint-env mocha */
'use strict'
var expect = require('chai').expect
var oco = require('../src/index.js')

describe('Manually creating OCO objects', () => {
  it('should create a root palette', () => {
    var root = new oco.Entry()
    expect(root.parent).to.equal(null)
    expect(root.name).to.equal('Root')
  })
  it('is possible to create more than one entry with sharing one dotpath', () => {
    var root = new oco.Entry()
    var colorA = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')])
    var colorB = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')])
    root.addChild(colorA)
    root.addChild(colorB)
    expect(root.children).to.have.length(2)
  })
})

describe('Manually manipulating OCO objects', () => {
  it('should be able to remove entries', () => {
    var root = new oco.Entry()
    var color = new oco.Entry('colorname', [oco.ColorValue.fromColorValue('#FF0')])
    root.addChild(color)
    expect(root.children).to.have.length(1)
    root.removeChild(color)
    expect(root.children).to.have.length(0)
  })
  it('should be able to remove colors with dotpath', () => {
    var root = new oco.Entry()
    var color = new oco.Entry('colorname', [oco.ColorValue.fromColorValue('#FF0')])
    root.addChild(color)
    expect(root.children).to.have.length(1)
    root.remove('colorname')
    expect(root.children).to.have.length(0)
  })
  it('should be able to remove all colors with same dotpath', () => {
    var root = new oco.Entry()
    var colorA = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')])
    var colorB = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')])
    root.addChild(colorA)
    root.addChild(colorB)
    expect(root.children).to.have.length(2)
    root.remove('color')
    expect(root.children).to.have.length(0)
  })
  it('should be able to remove palettes with dotpath', () => {
    var root = new oco.Entry()
    var color = new oco.Entry('colorname', [oco.ColorValue.fromColorValue('#FF0')])
    root.set('foo.bar.colorname', color)
    expect(root.children).to.have.length(1)
    expect(root.get('foo.bar').children).to.have.length(1)
    root.remove('foo')
    expect(root.children).to.have.length(0)
  })
})

describe('Deep creating syntax', () => {
  it('should create an entry structure', () => {
    var root = new oco.Entry()
    var color = new oco.Entry('color', [oco.ColorValue.fromColorValue('#FF0')])
    expect(color.type).to.equal('Color')
    root.set('foo.bar.baz.color', color)
    expect(root.get('foo').get('bar').get('baz').get('color').get('hex').hexcolor()).to.equal('#FFFF00')
  })
  it('should overwrite entry name', () => {
    var root = new oco.Entry()
    var color = new oco.Entry('entryname', [oco.ColorValue.fromColorValue('#FF0')])
    expect(color.type).to.equal('Color')
    root.set('newentryname', color)
    expect(root.get('newentryname').name).to.equal('newentryname')
  })
  it('should overwrite existing entry', () => {
    var root = new oco.Entry()
    var colorA = new oco.Entry('colornameA', [oco.ColorValue.fromColorValue('#FFFFFF')])
    var colorB = new oco.Entry('colornameB', [oco.ColorValue.fromColorValue('#000000')])

    root.set('colornameA', colorA)
    expect(root.get('colornameA').hexcolor()).to.equal('#FFFFFF')
    root.set('colornameA', colorB)
    expect(root.get('colornameA').hexcolor()).to.equal('#000000')
  })
  it('should overwrite existing entry with different type', () => {
    var root = new oco.Entry()
    var colorA = new oco.Entry('entrynameA', [oco.ColorValue.fromColorValue('#FFFFFF')])
    var referenceA = new oco.Reference('entrynameB', '=xxx')

    root.set('entrynameA', colorA)
    expect(root.get('entrynameA').hexcolor()).to.equal('#FFFFFF')
    root.set('entrynameA', referenceA)
    expect(root.get('entrynameA').type).to.equal('Reference')
  })
})
