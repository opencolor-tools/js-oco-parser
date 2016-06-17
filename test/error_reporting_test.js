/* eslint-env mocha */
'use strict'

import {expect} from 'chai'
import * as oco from '../src/index'
import ParserError from '../lib/parser_error'

/** @test {parse} */
describe('Basic error handling in Parser', () => {
  it('should raise exception on illegal nesting of colors and colorvalues', () => {
    var test = `
block:
  color: #fff
  #ccc
`
    var fn = function () { oco.parse(test) }
    expect(fn).to.throw()
  })

  it('should raise exception on parse error', () => {
    var test = `
block:
  color: #fff;
`
    var fn = function () { oco.parse(test) }
    expect(fn).to.throw()
  })
  it('should raise exception on parse error with correct line number', () => {
    var test = `
block:
  color: #fff
`
    try {
      oco.parse(test)
    } catch (ex) {
      expect(ex.constructor).to.equal(ParserError)
      console.log(ex.error, ex)
      expect(ex.error.line).to.equal(2)
    }
  })
})
