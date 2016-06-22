'use strict'

import parser from './parser'
import Renderer from './renderer'

/**
 * Render an OCO tree into a string
 * @param {Entry} tree OCO Tree
 * @return {string} Rendered OCO
 */
export function render (tree) {
  return new Renderer(tree).render()
}

/**
 * Parses a string into an OCO tree
 * @param {string} data String or anything that can be converted to a String with toString()
 * @return {Entry} OCO tree
 * @throws {ParserError} if input is not valid OCO
 */
export function parse (data) {
  return parser(data.toString())
}

export {default as Entry} from './entry'
export {default as ColorValue} from './color_value'
export {default as Reference} from './reference'

// export { render, parse, Entry, ColorValue, Reference }
