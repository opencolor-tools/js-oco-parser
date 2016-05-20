/* jshint -W097 */
'use strict'

var parse = require('./parser')
var Entry = require('./entry')
var ColorValue = require('./color_value')
var Reference = require('./reference')
var Metadata = require('./metadata')
var Renderer = require('./renderer')

var parser = {
  parse (data) {
    // currently, the new parser needs a string.
    // TODO: Make the parser work with Buffers and Streams if possible.
    return parse(data.toString())
  },
  render (tree) {
    return new Renderer(tree).render()
  },
  Entry,
  ColorValue,
  Reference,
  Metadata
}

module.exports = parser
