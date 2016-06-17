'use strict'

import ParserError from './parser_error'
import MetaProxy from './meta_proxy'

/**
 * Reference is a pointer to another Palette or Color
 */
export default class Reference {
  /**
   * Create new Reference by name and name of referenced palette or color
   * @param {string} name Name of Reference
   * @param {string} refName Name of referenced Entry
   */
  constructor (name, refName) {
    this._name = name
    this.refName = refName
    if (this.refName.match(/^=/)) {
      this.refName = this.refName.replace(/^= ?/, '')
    }
    this.parent = null
    this.type = 'Reference'
    this.metadata = new MetaProxy(this)
  }

  /**
   * @type {string}
   */
  set name (newName) {
    newName = newName.replace(/[\.\/]/g, '')
    this._name = newName
  }

  get name () {
    return this._name
  }

  /**
   * Rename or Move Reference to different place in OCO tree
   * @param {string} newName new name or dotpath
   */
  rename (newName) {
    newName = newName.replace(/[\.\/]/g, '')
    if (this.isRoot()) {
      this._name = newName
    } else {
      let newPath = [this.parent.path(), newName].filter((e) => e !== '').join('.')
      this.moveTo(newPath)
    }
  }

  /**
   * @return absolute dotpath for the referenced Entry
   */
  get absoluteRefName () {
    var refPath = this.refName.split('.')
    var refName = this.resolveRefName(this.parent, refPath)
    return refName
  }

  /**
   * Recursively resolve a reference name in the OCO tree
   * @param current entry to resolve from
   * @param {string[]} refPath current an array of path elements
   * @param {boolean} [notUp=false] if true, resolving only continues downwards a tree branch
   * @return {string} a resolved absolute path
   */
  resolveRefName (current, refPath, notUp) {
    var resolvedEntry = current.get(refPath[0])
    if (resolvedEntry) {
      if (refPath.length > 1) {
        return this.resolveRefName(resolvedEntry, refPath.slice(1), true)
      } else {
        return resolvedEntry.path()
      }
    }
    if (current.parent && !notUp) {
      return this.resolveRefName(current.parent, refPath)
    } else {
      return null
    }
  }
  /**
   * path of this Reference within the OCO tree
   * @return {string} dotpath
   */
  path () {
    if (!this.parent) { return '' }
    return [this.parent.path(), this.name].filter((e) => e !== '').join('.')
  }
  /** @ignore */
  isRoot () {
    return false
  }
  /**
   * Returns root of OCO tree
   * @return Root of OCO tree
   */
  root () {
    if (this.isRoot()) {
      return this
    } else {
      return this.parent.root()
    }
  }
  /**
   * Moves current element to a new place in the OCO tree
   * @param {string} newPath new dotpath to move to
   * @param {boolean} [maintainReferences=true] If true, references will be moved accordingly
   */
  moveTo (newPath, maintainReferences = true) {
    let oldPath = this.path()
    if (maintainReferences) {
      this.root().updateReferences(oldPath, newPath)
    }
    this.parent.removeChild(this)
    this.root().set(newPath, this)
  }
  /**
   * Returns the Entry this reference is pointing to
   * @return Entry referenced or null if reference doesn't point to something valid
   */
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
  /**
   * Resolve reference. Only resolves once, so use resolved to actually to full resolving
   * @param current Current starting point (Entry) to resolve from
   * @param {string[]} refPath array of path fragments to resolve
   * @param {boolean} [notUp=false] if true, don't climb up the tree
   * @return resolved Entry or null if reference points to nothing
   */
  resolve (current, refPath, notUp) {
    var resolved = current.get(refPath[0])
    if (resolved) {
      if (refPath.length > 1) {
        resolved = this.resolve(resolved, refPath.slice(1), true)
      }
      if (resolved) {
        return resolved
      }
    }
    if (current.parent && !notUp) {
      return this.resolve(current.parent, refPath)
    } else {
      return null
    }
  }
  /** @ignore */
  addParent (element) {
    if (element['refName']) {
      element.parent = this
    }
  }
  /** @ignore */
  addMetadata (metadata) {
    this.metadata.add(metadata)
  }

  /** @ignore */
  getMetadata (key) {
    return this.metadata.get(key)
  }

  /**
   * Clone this Reference
   * @todo does this ignore Metadata by design?
   * @return {Reference} clone of current reference
   */
  clone () {
    var clone = new Reference(this.name, this.refName)
    return clone
  }
}
