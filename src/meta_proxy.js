/* jshint -W097 */
'use strict'
var ParserError = require('./parser_error')
var metaValue = require('./meta_value')

class MetaProxy {
  constructor (parent) {
    this.parent = parent
    this.hash = {}
    this.data = []
  }

  get (key) {
    let result = null
    if (typeof key === 'string') {
      result = this.hash[key]
    } else {
      result = this.data[key]
    }
    if (!result) {
      if (this.parent.type === 'Reference') {
        result = this.parent.resolved().metadata.get(key)
      }
    }
    return result
  }

  set (key, value) {
    value = metaValue(value)
    this.addParent(value)
    this.data.push(value)
    this.hash[key] = value
  }

  addParent (element) {
    if (element['refName']) {
      element.parent = this.parent
    }
  }

  add (metadata) {
    Object.keys(metadata).forEach((key) => {
      if (!key.match(/\//)) {
        throw (new ParserError("Metadata keys must contain at least one slash. (Failed at ''" + key + "')", {}))
      }
      this.set(key, metadata[key])
    }, this)
  }

  keys (onlyLocal = false) {
    let localKeys = Object.keys(this.hash)
    let remoteKeys = []
    if (!onlyLocal && this.parent.type === 'Reference') {
      remoteKeys = this.parent.resolved().metadata.keys()
    }
    return localKeys.concat(remoteKeys)
  }

  clone () {
    let cloneData = this.data.map((d) => d.clone ? d.clone() : d)
    let clone = new MetaProxy(cloneData)
    // what about fallbacks?
    return clone
  }
}

module.exports = MetaProxy
