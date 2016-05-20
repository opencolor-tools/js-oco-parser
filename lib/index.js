'use strict'

var _parse = require('./parser')
var Entry = require('./entry')
var ColorValue = require('./color_value')
var Reference = require('./reference')
var Metadata = require('./metadata')
var Renderer = require('./renderer')

var parser = {
  parse: function parse (data) {
    // currently, the new parser needs a string.
    // TODO: Make the parser work with Buffers and Streams if possible.
    return _parse(data.toString())
  },
  render: function render (tree) {
    return new Renderer(tree).render()
  },

  Entry: Entry,
  ColorValue: ColorValue,
  Reference: Reference,
  Metadata: Metadata
}

module.exports = parser
