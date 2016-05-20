'use strict'

import ParserError from './parser_error'
import MetaProxy from './meta_proxy'

function flatten (ary) {
  var ret = []
  for (var i = 0; i < ary.length; i++) {
    if (Array.isArray(ary[i])) {
      ret = ret.concat(flatten(ary[i]))
    } else {
      ret.push(ary[i])
    }
  }
  return ret
}

export default class Entry {
  constructor (name, children, type, position) {
    this._name = name || 'Root'
    this.position = position
    this.children = []
    this.parent = null
    this.metadata = new MetaProxy(this)
    this.type = type || 'Palette'

    this.addChildren(flatten(children || []), false)
    this.validateType()
    this.forEach = Array.prototype.forEach.bind(this.children) // the magic of JavaScript.
  }
  set name (newName) {
    this._name = newName.replace(/\./g, '')
  }
  get name () {
    return this._name
  }
  get (nameOrIndex) {
    if (typeof nameOrIndex === 'string') {
      if (nameOrIndex.match(/\./)) { // dotpath, so we need to do a deep lookup
        var pathspec = nameOrIndex.split('.')
        return this.get(pathspec.shift()).get(pathspec.join('.'))
      }
      return this.children.filter((child) => child.name === nameOrIndex).pop()
    } else {
      return this.children[nameOrIndex]
    }
  }

  isRoot () {
    return !this.parent
  }

  remove (path) {
    var entry = this.get(path)
    if (!entry) {
      return
    }
    entry.parent.removeChild(entry)
    // if there are multiple children with the same dotpath
    this.remove(path)
  }

  set (path, entry) {
    // if ('string' === typeof nameOrIndex) {
    if (path.match(/\./)) { // dotpath, so we need to do a deep lookup
      var pathspec = path.split('.')
      var firstPart = pathspec.shift()
      var existingEntry = this.get(firstPart)
      if (existingEntry && existingEntry.type === 'Palette') {
        existingEntry.set(pathspec.join('.'), entry)
      } else {
        var newGroup = new Entry(firstPart)
        this.set(firstPart, newGroup)
        newGroup.set(pathspec.join('.'), entry)
      }
    } else {
      entry.name = path
      entry.parent = this
      if (this.get(path)) {
        // replace existing entries
        this.children.filter((child) => child.name === path).forEach((child) => {
          this.replaceChild(child, entry)
        })
      } else {
        // add entry
        this.children.push(entry)
      }
    }
  // } else {
  //   if (this.children[nameOrIndex]) {
  //     this.children[nameOrIndex].parent = null // nullifying reference
  //   }
  //   this.children[nameOrIndex] = entry
  //   entry.parent = this
  // }
  }

  path () {
    if (!this.parent) { return '' }
    return [this.parent.path(), this.name].filter((e) => e !== '').join('.')
  }

  addParent (element) {
    if (element['refName']) {
      element.parent = this
    }
  }

  addMetadata (metadata) {
    this.metadata.add(metadata) // transitioning
  }

  removeChild (child) {
    var index = this.children.indexOf(child)
    this.children = this.children.slice(0, index).concat(this.children.slice(index + 1))
  }

  replaceChild (child, newEntry) {
    var currentPosition = this.children.indexOf(child)
    this.children.splice(currentPosition, 1, newEntry)
  }

  addChild (child, validate = true, position = -1) {
    if (!child) { return }
    var type = child.type
    // we're basically only separating meta data.
    if (type === 'Metadata') {
      throw (new Error('API error, please use .addMetadata or .metadata.add instead'))
    } else if (type === 'Metablock') {
      throw (new Error('API error, please use .addMetadata or .metadata.add instead'))
    } else {
      child.parent = this
      if (position === -1) {
        this.children.push(child)
      } else {
        this.children.splice(position, 0, child)
      }
    }

    if (validate) {
      this.validateType()
    }
  }

  addChildren (children) {
    children.forEach((child) => {
      this.addChild(child, false)
    })
  }

  validateType () {
    var types = []
    this.children.forEach((child) => {
      let type = child.type
      if (types.indexOf(type) === -1) { types.push(type) }
    })
    types = types.sort()
    if (types.indexOf('ColorValue') !== -1 && types.indexOf('Color') !== -1) {
      let message = `Palette "${this.name}" cannot contain colors and color values at the same level (line: ${this.position.first_line - 1})`
      throw (new ParserError(message, { line: this.position.first_line }))
    }
    if (types.indexOf('Palette') !== -1 && types.indexOf('ColorValue') !== -1) {
      let message = `Palette "${this.name}" cannot contain palette and color values at the same level (line: ${this.position.first_line - 1})`
      throw (new ParserError(message, { line: this.position.first_line }))
    }
    if (types.indexOf('ColorValue') !== -1 && this.type === 'Palette') {
      this.type = 'Color'
    }
  }

  getMetadata (key) {
    return this.metadata.get(key)
  }

  traverseTree (filters, callback) {
    var filter = false
    if (typeof filters === 'string') { filters = [filters] }
    if (filters && filters.length > 0) { filter = true }
    this.children.forEach((child) => {
      if (child.type !== 'ColorValue' && (!filter || filters.indexOf(child.type) !== -1)) {
        callback(child)
      }
      if (child.children && child.children.length > 0) {
        child.traverseTree(filters, callback)
      }
    })
  }

  hexcolor (withAlpha = false) {
    if (this.type !== 'Color') { return null }
    var identifiedColor = this.children.filter((child) => child.isHexExpressable())[0]
    if (identifiedColor) { return identifiedColor.hexcolor(withAlpha) }
    return null
  }

  clone () {
    var children = this.children.map((child) => child.clone())
    var clone = new Entry(this.name, children, this.type, this.position)
    this.metadata.keys().forEach((key) => {
      let meta = this.metadata.get(key)
      clone.metadata.set(key, meta.clone ? meta.clone() : meta)
    })
    return clone
  }

}
