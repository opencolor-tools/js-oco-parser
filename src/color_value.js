'use strict'

import tinycolor from 'tinycolor2'
import ParserError from './parser_error'

/**
 * Represents a color value which can be either an identifiedValue or a freeform value
 */
export default class ColorValue {
  /**
   * @param {string} name of the color space
   * @param {string} color value (unparsed)
   * @param {tinycolor} [identifiedValue] A tinycolor identified color value
   */
  constructor (name, value, identifiedValue = null) {
    /** @type {string} **/
    this.name = name
    /** @type {string} **/
    this.value = value
    /** @type {tinycolor} **/
    this.identifiedValue = identifiedValue
    this.parent = null
    /** @type {string} **/
    this.type = 'ColorValue'
  }
  /**
   * Returns an hexcolor if the color is expressable as hexcolor
   * @param {boolean} [withAlpha=false] returns a hexcolor with alphachannel if true
   * @return {?string} hexcolor as string. null if color cannot be expressed as hexcolor
   */
  hexcolor (withAlpha = false) {
    if (this.isHexExpressable()) {
      if (withAlpha) {
        return this.identifiedValue.toString('hex8').toUpperCase()
      }
      return this.identifiedValue.toString('hex6').toUpperCase()
    }
    return null
  }
  /**
   * Returns true if color can be expressed as a hexcolor
   * @return {boolean} true if color value is expressable as a hex color
   */
  isHexExpressable () {
    return (this.identifiedValue != null)
  }
  /**
   * @ignore
   */
  clone () {
    return new ColorValue(this.name, this.value, this.identifiedValue)
  }

  /**
   * Helper to construct a ColorValue by handing over a string
   * @param {string} value A color value as string, in either hex format or COLORSPACE(COLORVALUE) format
   * @param {number} [line] Source line number to create meaningful error message if can't be parsed. (Safe to ignore)
   * @return {ColorValue} A ColorValue instance.
   * @throws {ParserError} If value can't be parsed.
   */
  static fromColorValue (value, line = null) {
    var parsed = tinycolor(value)
    if (parsed.isValid()) {
      return new ColorValue(parsed.getFormat(), value, parsed)
    }
    var space = value.match(/^(\w+)\((.*)\)$/)
    if (space) {
      return new ColorValue(space[1], space[0], null)
    }
    throw (new ParserError('Illegal Color Value: ' + value, {line: line}))
  }
}
