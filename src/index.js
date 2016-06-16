'use strict'

import parser from './parser'
import Entry from './entry'
import ColorValue from './color_value'
import Reference from './reference'
import Renderer from './renderer'

function parse (data) {
  return parser(data.toString())
}
function render (tree) {
  return new Renderer(tree).render()
}

let oco = {
  render,
  parse,
  Entry,
  ColorValue,
  Reference
}

export default oco
