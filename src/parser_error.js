/* jshint -W097 */
'use strict';

function ParserError(message, hash) {
  this.name = 'ParserError';
  this.message = message;
  this.error = hash;
}
ParserError.prototype = Object.create(Error.prototype);
ParserError.prototype.constructor = ParserError;
//
//
// class ParserError extends Error {
//   constructor(message, hash) {
//     super(message);
//     this.name = 'ParserError';
//     this.message = message;
//     this.error = hash;
//   }
// }

module.exports = ParserError;
