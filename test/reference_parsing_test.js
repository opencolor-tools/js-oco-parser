/* eslint-env mocha */
'use strict'
import {expect} from 'chai'
import * as oco from '../src/index'

/** @test {parse} */
describe('Parsing of References', () => {
  it('should parse a reference', () => {
    var test = `
color: #fff
ref color: =color
`
    var tree = oco.parse(test)
    // Only simple, same level references for now
    expect(tree.children[1].refName).to.equal('color')
    expect(tree.children[1].resolved().hexcolor()).to.equal('#FFFFFF')
  })

  it('should parse a deep reference', () => {
    var test = `
color: #fff
group:
  group color: #aea
  ref color: =color
  test: #000
another color: #ffe`
    var tree = oco.parse(test)
    // Only simple, same level references for now
    var refColor = tree.get('group').get('ref color')
    expect(refColor.refName).to.equal('color')
    expect(refColor.resolved().hexcolor()).to.equal('#FFFFFF')
  })

  it('should return a absolute ref name', () => {
    var test = `
one: #111111
three: #333333
group:
  one: #111111
  two: #222222
  refOne: =one
  refTwo: =group.two
  refThree: =three
  refThreeRef: =refThree
`
    var tree = oco.parse(test)
    var refOne = tree.get('group').get('refOne')
    var refTwo = tree.get('group').get('refTwo')
    var refThree = tree.get('group').get('refThree')
    var refThreeRef = tree.get('group').get('refThreeRef')
    expect(refOne.absoluteRefName).to.equal('group.one')
    expect(refTwo.absoluteRefName).to.equal('group.two')
    expect(refThree.absoluteRefName).to.equal('three')
    expect(refThreeRef.absoluteRefName).to.equal('group.refThree')
  })

  it('should parse a tree reference', () => {
    var test = `
color: #fff
group:
  group color: #aea
  ref color: =group.another color
  another color: #afa
`
    var tree = oco.parse(test)
    // Only simple, same level references for now
    var refColor = tree.get('group').get('ref color')
    expect(refColor.refName).to.equal('group.another color')
    expect(refColor.resolved().hexcolor()).to.equal('#AAFFAA')
  })

  it('should parse a non obvious tree reference', () => {
    var test = `
a:
  b: #fff
  a:
    c: #afa
    subgroup ref color: =a.b
`
    var tree = oco.parse(test)
    // Only simple, same level references for now
    var refColor = tree.get('a').get('a').get('subgroup ref color')
    expect(refColor.refName).to.equal('a.b')
    expect(refColor.resolved().hexcolor()).to.equal('#FFFFFF')
  })

  it('should resolve references of references', () => {
    var test = `
a: =b
b: =c
c: #afa
`

    var tree = oco.parse(test)
    // Only simple, same level references for now
    expect(tree.get('a').resolved().hexcolor()).to.equal('#AAFFAA')
  })

  it('should break on resolving single circular references', () => {
    var test = `
a: =b
b: =a
`
    var tree = oco.parse(test)
    // Only simple, same level references for now
    expect(tree.get('a').resolved).to.throw()
  })

  it('should break on resolving multi circular references', () => {
    var test = `
a: =b
b: =c
c: =a
`
    var tree = oco.parse(test)
    // Only simple, same level references for now
    expect(tree.get('a').resolved).to.throw()
  })

  it('should resolve references with number names', () => {
    var test = `
800: #cc0000
a: =800
`
    var tree = oco.parse(test)
    // Only simple, same level references for now
    expect(tree.get('a').resolved().hexcolor()).to.equal('#CC0000')
  })
})

/** @test {parse} */
describe('Parsing of Metadata on References', () => {
  it('should parse a local ref metadata', () => {
    var test = `
a: #fff
b: =a
  oct/meta: foo
`
    var tree = oco.parse(test)
    expect(tree.get('b').getMetadata('oct/meta')).to.equal('foo')
  })
  it('should find metadata on ref target', () => {
    var test = `
a: #fff
  oct/meta: foo
b: =a
`
    var tree = oco.parse(test)
    expect(tree.get('b').getMetadata('oct/meta')).to.equal('foo')
  })
})
/** @test {parse} */
describe('Parsing of URL References', () => {
  it('should bork if URL ref cannot be resolved', () => {
    var test = `
    a: =url(file://test.url.oco)
`
    function testParse () {
      oco.parse(test)
    }
    expect(testParse).to.throw()
  })

  it('should call back with url', () => {
    var test = `
a: =url(file://test.url.oco)
`
    var resolveURLCalls = 0
    function resolveURL (url) {
      console.log(url)
      resolveURLCalls++
      return 'b: #fff'
    }
    var tree = oco.parse(test, resolveURL)
    expect(resolveURLCalls).to.equal(1)
    expect(tree.get('a').get('b').hexcolor()).to.equal('#FFFFFF')
  })
})
