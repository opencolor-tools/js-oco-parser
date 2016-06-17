'use strict'

/**
 * @ignore
 */
export default function ParserError (message, hash) {
  this.name = 'ParserError'
  this.message = message
  this.error = hash
}
ParserError.prototype = Object.create(Error.prototype)
ParserError.prototype.constructor = ParserError
