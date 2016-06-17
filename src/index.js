'use strict'

import parser from './parser'
import Entry from './entry'
import ColorValue from './color_value'
import Reference from './reference'
import Renderer from './renderer'

/**
 * Render an OCO tree into a string
 * @param {Entry} tree OCO Tree
 * @return {string} Rendered OCO
 */
function render (tree) {
  return new Renderer(tree).render()
}
/**
 * Parses a string into an OCO tree
 * @param {string} data String or anything that can be converted to a String with toString()
 * @return {Entry} OCO tree
 * @throws {ParserError} if input is not valid OCO
 */
function parse (data) {
  return parser(data.toString())
}

export { render, parse, Entry, ColorValue, Reference }
