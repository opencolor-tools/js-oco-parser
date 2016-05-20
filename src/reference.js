'use strict'

var ParserError = require('./parser_error')

class Reference {
  constructor (name, refName) {
    this.name = name
    this.refName = refName
    if (this.refName.match(/^=/)) {
      this.refName = this.refName.replace(/^= ?/, '')
    }
    this.parent = null
    this.type = 'Reference'
  }
  path () {
    if (!this.parent) { return '' }
    return [this.parent.path(), this.name].filter((e) => e !== '').join('.')
  }
  isRoot () {
    return false
  }
  resolved (stack = []) {
    if (stack.indexOf(this) !== -1) {
      throw (new ParserError('References can not be circular!', {}))
    }
    var refPath = this.refName.split('.')
    var reference = this.resolve(this.parent, refPath)
    if (reference) {
      if (reference['refName']) {
        return reference.resolved(stack.concat([this]))
      } else {
        return reference
      }
    }
    return null
  }

  resolve (current, path, notUp) {
    var resolved = current.get(path[0])
    if (resolved) {
      if (path.length > 1) {
        resolved = this.resolve(resolved, path.slice(1), true)
      }
      if (resolved) {
        return resolved
      }
    }
    if (current.parent && !notUp) {
      return this.resolve(current.parent, path)
    } else {
      return null
    }
  }

  clone () {
    var clone = new Reference(this.name, this.refName)
    return clone
  }
}

module.exports = Reference
