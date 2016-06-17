'use strict'

import Entry from './entry'
import ColorValue from './color_value'
import Reference from './reference'
import ParserError from './parser_error'

/** @ignore */
export default function parse (input) {
  let tokenized = tokenize(input.toString())
  let transformed = transform(tokenized)
  let adjusted = adjustTypes(transformed)
  let metaadjusted = normalizeMetadata(adjusted)
  let objectified = objectify(metaadjusted)
  return objectified
}

function tokenize (input) {
  let output = []
  let lines = input.split('\n')
  lines.forEach(function (line) {
    line = line.replace(/\/\/.*$/, '') // remove comments
    let tokens = line.split(':').map((t) => t.trim())
    output.push({indent: indent(line), tokens: tokens})
  })
  return output
}

function indent (line) {
  let m = line.match(/^[ \t]+/)
  if (!m) { return 0 }
  return m[0].length
}

function makeArrayUnique (inp) { // http://stackoverflow.com/questions/1960473/unique-values-in-an-array
  let a = []
  for (var i = 0, l = inp.length; i < l; i++) {
    if (a.indexOf(inp[i]) === -1) {
      a.push(inp[i])
    }
  }
  return a
}

function transform (input) {
  let output = {children: [], type: 'root', name: 'root', parent: null, line: 0}
  let currentIndent = input[0].indent
  let currentGroup = output
  input.forEach(function (line, i) {
    if (line.tokens.length === 1 && line.tokens[0] === '') { return } // remove empty lines from the stream)

    if (line.indent > currentIndent) {
      currentGroup = currentGroup.children[currentGroup.children.length - 1]
    } else if (line.indent < currentIndent) {
      currentGroup = currentGroup.parent
    }
    currentIndent = line.indent

    if (line.tokens.length === 2 && line.tokens[1] === '') { // a Group
      if (line.tokens[0].match(/\//)) { // Metadata
        currentGroup.children.push({type: 'metagroup', name: line.tokens[0], parent: currentGroup, children: [], line: i})
      } else {
        currentGroup.children.push({type: 'palette', name: line.tokens[0], parent: currentGroup, children: [], line: i})
      }
    } else if (line.tokens.length === 1) { // a color or a meta group with trailing slash
      if (line.tokens[0].match(/\/$/)) {
        currentGroup.children.push({type: 'metagroup', name: line.tokens[0], parent: currentGroup, children: [], line: i})
      } else if (line.tokens[0].match(/\//)) {
        throw (new ParserError('A meta group must either have a trailing slash or must be closed with a colon', {line: i}))
      } else if (line.tokens[0].match(/^=/)) {
        currentGroup.children.push({type: 'reference', value: line.tokens[0], parent: currentGroup, children: [], line: i})
      } else {
        currentGroup.children.push({type: 'colorvalue', value: line.tokens[0], parent: currentGroup, children: [], line: i})
      }
    } else if (line.tokens.length === 2) { // everything else is just a kv
      if (line.tokens[0].match(/\//)) {
        currentGroup.children.push({type: 'metavalue', name: line.tokens[0], value: line.tokens[1], parent: currentGroup, children: [], line: i})
      } else {
        currentGroup.children.push({type: 'value', name: line.tokens[0], value: line.tokens[1], parent: currentGroup, children: [], line: i})
      }
    } else { // other token lengths are syntax errors
      throw (new ParserError('Too many colons', {line: i}))
    }
  })
  return output
}

function adjustTypes (tree) {
  tree.children.forEach(function (child, i) {
    if (child.type === 'palette') {
      let childTypes = makeArrayUnique(child.children.map((c) => c.type))
      if (childTypes.indexOf('colorvalue') !== -1) {
        if (childTypes.indexOf('palette') !== -1) {
          throw (new ParserError('Color cannot contain both color values and a subpalette', { line: child.line }))
        } else if (childTypes.indexOf('value') !== -1) {
          throw (new ParserError('Color cannot contain both color values and named colors', { line: child.line }))
        }
        child.type = 'color'
      }
    } else if (child.type === 'value') {
      if (child.parent.type === 'metagroup') {
        child.type = 'metavalue'
        checkForChildren('Metavalue', child)
      } else {
        if (child.value.match(/^=/)) {
          child.type = 'reference'
        } else {
          child.type = 'color'
          child.children.push({type: 'colorvalue', value: child.value, parent: child, children: [], line: child.line})
          delete (child.value)
        }
      }
    } else if (child.type === 'colorvalue') {
      checkForChildren('Colorvalue', child)
    }
    adjustTypes(child)
  })
  return tree
}

function checkForChildren (type, obj) {
  if (obj.children.length > 0) {
    throw (new ParserError(`${type} ${obj.name} can't have children`, { line: obj.line }))
  }
}

function normalizeMetadata (tree) {
  tree.children.forEach(function (child, i) {
    normalizeMetadata(child)
    if (child.type === 'metavalue') {
      if (tree.type === 'metagroup') {
        if (!tree.parent['metadata']) { tree.parent.metadata = [] }
        let combinedName = [tree.name, child.name].join('/').replace(/\/\//g, '/')
        addMetadata(tree.parent, child, combinedName)
        tree.children[i] = null
      } else {
        addMetadata(tree, child)
        tree.children[i] = null
      }
    } else if (child.type === 'metagroup') {
      if (child['metadata']) {
        let keys = Object.keys(child.metadata)
        keys.forEach(function (key) {
          let combinedName = [child.name, key].join('/').replace(/\/\//g, '/')
          addMetadata(tree, child, combinedName)
        })
      }
      tree.children[i] = null
    }
  })
  tree.children = tree.children.filter((a) => !!a)
  return tree
}

function addMetadata (obj, metadata, name = null) {
  if (!obj['metadata']) { obj.metadata = [] }
  if (name) { metadata.name = name }
  metadata.parent = obj
  obj.metadata.push(metadata)
}

function objectify (tree) {
  let children = tree.children || []
  children = children.map((c) => objectify(c))

  if (tree.type === 'root' || tree.type === 'palette') {
    let palette = new Entry(tree.name, children, 'Palette', {line: tree.line})
    let metadata = {}
    if (tree.metadata) {
      tree.metadata.forEach((md) => {
        metadata[md.name] = md.value
      })
    }
    palette.addMetadata(metadata)
    return palette
  } else if (tree.type === 'color') {
    let color = new Entry(tree.name, children, 'Color', {line: tree.line})
    color.children = children
    let metadata = {}
    if (tree.metadata) {
      tree.metadata.forEach((md) => {
        metadata[md.name] = md.value
      })
    }
    color.addMetadata(metadata)
    return color
  } else if (tree.type === 'colorvalue') {
    let cv = ColorValue.fromColorValue(tree.value, tree.line)
    return cv
  } else if (tree.type === 'reference') {
    let ref = new Reference(tree.name, tree.value)
    let metadata = {}
    if (tree.metadata) {
      tree.metadata.forEach((md) => {
        metadata[md.name] = md.value
      })
    }
    ref.addMetadata(metadata)
    return ref
  }
}
