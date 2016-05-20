/* jshint -W097 */
'use strict'

class Metadata {
  constructor (name, value) {
    this.name = name
    this.value = value
    this.type = 'Metadata'
    this.parent = null
  }
}

module.exports = Metadata
