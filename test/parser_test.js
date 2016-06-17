/* eslint-env mocha */
'use strict'
import {expect} from 'chai'
import * as oco from '../src/index'
import fs from 'fs'

/** @test {parse} */
describe('Parser', () => {
  it('should parse a single color', () => {
    var test = 'color: #ff0022'
    var tree = oco.parse(test)
    expect(tree.name).to.equal('root')
    expect(tree.get('color').type).to.equal('Color')
    expect(tree.get('color').hexcolor()).to.equal('#FF0022')
  })

  it('should allow numbers as color names', () => {
    var test = '001: #ff0022\n'
    var tree = oco.parse(test)
    expect(tree.name).to.equal('root')
    expect(tree.get('001').type).to.equal('Color')
    expect(tree.get('001').hexcolor()).to.equal('#FF0022')
  })

  it('should allow hexnumbers as color names', () => {
    var test = 'f00: #f00022\n'
    var tree = oco.parse(test)
    expect(tree.name).to.equal('root')
    expect(tree.get('f00').type).to.equal('Color')
    expect(tree.get('f00').hexcolor()).to.equal('#F00022')
  })

  it('should allow parentheses in color names', () => {
    var test = 'vollfarbe (rot) super: #f00022\n'
    var tree = oco.parse(test)
    expect(tree.name).to.equal('root')
    expect(tree.get('vollfarbe (rot) super').type).to.equal('Color')
    expect(tree.get('vollfarbe (rot) super').hexcolor()).to.equal('#F00022')
  })

  it('should allow commas in color names', () => {
    var test = 'vollfarbe, super: #f00022\n'
    var tree = oco.parse(test)
    expect(tree.name).to.equal('root')
    expect(tree.get('vollfarbe, super').type).to.equal('Color')
    expect(tree.get('vollfarbe, super').hexcolor()).to.equal('#F00022')
  })

  it('should allow commas and parentheses in color names', () => {
    var test = 'Minimal (SQUARE, configured): #f00022\n'
    var tree = oco.parse(test)
    expect(tree.name).to.equal('root')
    expect(tree.get('Minimal (SQUARE, configured)').type).to.equal('Color')
  })

  it('should parse a single color as an rgb value', () => {
    var test = 'color: rgb(10,20,30)\n'
    var tree = oco.parse(test)
    expect(tree.name).to.equal('root')
    expect(tree.get('color').get('rgb').value).to.equal('rgb(10,20,30)')
  })

  it('should parse a single color as an special value', () => {
    var test = 'color: RAL(1003)\n'
    var tree = oco.parse(test)
    expect(tree.name).to.equal('root')
    expect(tree.get('color').get('RAL').value).to.equal('RAL(1003)')
  })

  it('should parse a single color with umlaut', () => {
    var test = 'Hintergrund Primär: #FFFFFF\n'
    var tree = oco.parse(test)
    expect(tree.get('Hintergrund Primär').hexcolor()).to.equal('#FFFFFF')
  })

  it('should parse a single color with special chars', () => {
    var test = 'Google+: #C52E10\n'
    var tree = oco.parse(test)
    expect(tree.get('Google+').hexcolor()).to.equal('#C52E10')
  })

  it('should parse a single color given as block', () => {
    var test = `
color:
  #ff0022
`
    var tree = oco.parse(test)
    expect(tree.parent).to.equal(null)
    expect(tree.name).to.equal('root')
    expect(tree.get('color').type).to.equal('Color')
    expect(tree.get('color').hexcolor()).to.equal('#FF0022')
  })

  it('should parse a simple group', () => {
    var test = `
group name:
  yellow: #ff0000
`
    var tree = oco.parse(test)
    expect(tree.get('group name').get('yellow').hexcolor()).to.equal('#FF0000')
  })

  it('should parse a simple group with colors after it', () => {
    var test = `
group name:
  yellow: #ff0000

red: #f00
`
    var tree = oco.parse(test)
    expect(tree.get('group name').get('yellow').hexcolor()).to.equal('#FF0000')
  })

  it('should parse a simple group with more than one color', () => {
    var test = `
group name:
  yellow: #ff0000
  green: #0f0
`
    var tree = oco.parse(test)
    expect(tree.get('group name').get('yellow').hexcolor()).to.equal('#FF0000')
    expect(tree.get('group name').get('green').hexcolor()).to.equal('#00FF00')
  })

  it('should not treat a group named Root as Root type', () => {
    var test = `
Group1:
  50: #E3F2FD
  800: #1565C0
Root:
  50: #E3F2FD
  800: #1565C0`
    var tree = oco.parse(test)
    expect(tree.get('Root').type).to.equal('Palette')
    expect(tree.get('Root').parent).to.not.equal(null)
  })

  it('should overwrite with last hit on key clashes', () => {
    var test = `
color: #fff
color: #000
`
    var tree = oco.parse(test)
    expect(tree.get('color').hexcolor()).to.equal('#000000')
  })

  it('a child should know its parents', () => {
    var test = 'color: #fff\n'
    var tree = oco.parse(test)
    expect(tree.get('color').parent).to.equal(tree)
  })

  it('should parse with newlines in front', () => {
    var test = '\n\ncolor: #fff\n'
    var tree = oco.parse(test)
    expect(tree.get('color').hexcolor()).to.equal('#FFFFFF')
  })

  it('should parse with newline in front', () => {
    var test = '\ncolor: #fff\n'
    var tree = oco.parse(test)
    expect(tree.get('color').hexcolor()).to.equal('#FFFFFF')
  })
})

/** @test {parse} */
describe('Parsing comments', () => {
  it('should parse single line comments', () => {
    var test = 'color: #fff\n// Hello!\n'
    var tree = oco.parse(test)
    expect(tree.get('color').hexcolor()).to.equal('#FFFFFF')
  })

  it('should parse single line comments after block', () => {
    var test = `
group:
  color: #fff
// Hello!
`
    var tree = oco.parse(test)
    expect(tree.get('group').get('color').hexcolor()).to.equal('#FFFFFF')
  })

  it('should parse same line comments', () => {
    var test = 'color: #fff// Hello!\n'
    var tree = oco.parse(test)
    expect(tree.get('color').hexcolor()).to.equal('#FFFFFF')
  })

  it('should parse block lead comments', () => {
    var test = 'group: // Hello\n  color: #ffe\n'
    var tree = oco.parse(test)
    expect(tree.get('group').get('color').hexcolor()).to.equal('#FFFFEE')
  })

  it('should parse comments that start at beginning of line', () => {
    var test = 'group:\n  color: #ffe\n  // comment'
    var tree = oco.parse(test)
    expect(tree.get('group').get('color').hexcolor()).to.equal('#FFFFEE')
  })

  it('should parse empty comments', () => {
    var test = 'group:\n  color: #ffe\n  // '
    var tree = oco.parse(test)
    expect(tree.get('group').get('color').hexcolor()).to.equal('#FFFFEE')
  })

  it('should parse comments in meta blocks', () => {
    var test = "meta/:\n  data: #ffe // what's the vector, viktor?"
    var tree = oco.parse(test)
    expect(tree.getMetadata('meta/data').hexcolor()).to.equal('#FFFFEE')
  })
})

/** @test {Entry#get} */
describe('Parser access methods', () => {
  it('should allow for dual access via index and key', () => {
    var test = 'color: #fff\n'
    var tree = oco.parse(test)
    expect(tree.get(0).hexcolor()).to.equal('#FFFFFF')
    expect(tree.get('color').hexcolor()).to.equal('#FFFFFF')
  })

  it('should allow to forEach directly on the palette', () => {
    var test = `
color a: #fff
color b: #000
`
    var tree = oco.parse(test)
    var i = 0
    tree.forEach((color) => {
      expect(color.type).to.equal('Color')
      i++
    })
    expect(i).to.equal(2) // make sure that the inner asserts are even called :)
  })
})
/** @test {parse} */
describe('Parsing whitespace', () => {
  it('should parse whitespace in empty lines without indenting', () => {
    var test = '800: #1565C0\n  \n50: #E3F2FD'
    var tree = oco.parse(test)
    expect(tree.get('800').hexcolor()).to.equal('#1565C0')
  })

  it('should not bork on whitespace with wrong indent', () => {
    var test = 'group:\n  subgroup:\n    color: #1565C0\n  \n    other color: #E3F2FD'
    var tree = oco.parse(test)
    expect(tree.get('group').get('subgroup').get('color').hexcolor()).to.equal('#1565C0')
  })
})

/** @test {parse} */
describe('Parsing a more complex document', () => {
  it('should parse a single color', () => {
    var input = fs.readFileSync('test/fixtures/test_with_comments.oco')
    var tree = oco.parse(input)
    // basically just one assertion to verify the parsing worked.
    expect(tree.children[0].get('yellow').hexcolor()).to.equal('#C01016')
    expect(tree.get('group').getMetadata('meta/other/data')).to.equal('Super Cool Metadata')
  })
})
