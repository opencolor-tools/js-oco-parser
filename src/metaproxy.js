/* jshint -W097 */
'use strict'
var Metadata = require('./metadata')

class MetaProxy {
  constructor (data = []) {
    this.hash = []
    this.data = data
    data.forEach((d) => {
      this.hash[d.name] = d
    })
    this.fallbacks = []
  }
  get (key) {
    let result = null
    if (typeof key === 'string') {
      result = this.hash[key]
    } else {
      result = this.data[key]
    }
    if (!result) {
      result = this.fallbacks.find((fallback) => (typeof fallback[key] !== 'undefined'))[key]
    }
    return result
  }
  set (key, value) {
    let md = new Metadata(key, value)
    this.data.push(md)
    this.hash[key] = md
  }
  addFallback (fallback) {
    this.fallbacks.push(fallback)
  }
  clone () {
    let cloneData = this.data.map((d) => d.clone ? d.clone() : d)
    let clone = new MetaProxy(cloneData)
    // what about fallbacks?
    return clone
  }
}

module.exports = MetaProxy
