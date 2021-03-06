/* eslint-env mocha */
'use strict'

import {expect} from 'chai'
import {ColorValue} from '../src/index.js'

/** @test {ColorValue} */
describe('ColorValue', () => {
  /** @test {ColorValue.fromColorValue} */
  it('should create hex value', () => {
    var colorValue = ColorValue.fromColorValue('#FFA')
    expect(colorValue.value).to.equal('#FFA')
    expect(colorValue.name).to.equal('hex')
  })

  /** @test {ColorValue.fromColorValue} */
  it('should create rgb value', () => {
    var colorValue = ColorValue.fromColorValue('rgb(134,255,234)')
    expect(colorValue.value.toString('rgb')).to.equal('rgb(134,255,234)')
    expect(colorValue.name).to.equal('rgb')
  })

  /** @test {ColorValue.fromColorValue} */
  it('should create arbitrary value', () => {
    var colorValue = ColorValue.fromColorValue('RAL(1003)')
    expect(colorValue.value).to.equal('RAL(1003)')
    expect(colorValue.name).to.equal('RAL')
  })
})
