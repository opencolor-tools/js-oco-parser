'use strict'
import ParserError from './parser_error'
import metaValue from './meta_value'

function makeArrayUnique (inp) { // http://stackoverflow.com/questions/1960473/unique-values-in-an-array
  let a = []
  for (var i = 0, l = inp.length; i < l; i++) {
    if (a.indexOf(inp[i]) === -1) {
      a.push(inp[i])
    }
  }
  return a
}

/**
 * MetaProxy is a way to store and retrieve metadata in various ways
 * Specifically, it handles the fallback to look up metadata on references if the proxy itself
 * doesn't have that data.
 */
export default class MetaProxy {
  /*
   * @param parent reference to the parent object
   */
  constructor (parent) {
    this.parent = parent
    this._hash = {}
    this._data = []
  }
  /*
   * @param {string} key key to lookup
   * @return metadate or undefined.
   */
  get (key) {
    let result = null
    if (typeof key === 'string') {
      result = this._hash[key]
    } else {
      result = this._data[key]
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
    this._data.push(value)
    this._hash[key] = value
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
    let localKeys = Object.keys(this._hash)
    let remoteKeys = []
    if (!onlyLocal && this.parent.type === 'Reference') {
      remoteKeys = this.parent.resolved().metadata.keys()
    }
    return makeArrayUnique(localKeys.concat(remoteKeys))
  }
}
