'use strict';

/**
 * @ignore
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ParserError;
function ParserError(message, hash) {
  this.name = 'ParserError';
  this.message = message;
  this.error = hash;
}
ParserError.prototype = Object.create(Error.prototype);
ParserError.prototype.constructor = ParserError;
