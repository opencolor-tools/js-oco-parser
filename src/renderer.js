/* jshint -W097 */
'use strict'

class Renderer {
  constructor (root) {
    this.root = root
  }

  renderPalette (entry, indent) {
    var string = ''
    var childrenIndent = indent
    if (!entry.isRoot()) {
      string = this.renderIndent(indent) + entry.name + ':\n'
      childrenIndent += 1
    }
    string += this.renderMetadataEntries(entry, childrenIndent)
    string += this.renderChildren(entry, childrenIndent)
    return string
  }

  renderColor (entry, indent) {
    var metalength = entry.metadata.keys(true).length
    var childLength = entry.children.length
    var realIndent = 0
    var separator = ' '
    if (metalength > 0 || childLength > 1) {
      separator = '\n'
      realIndent = indent + 1
    }
    var string = this.renderIndent(indent) + entry.name + ':' + separator
    string += this.renderChildren(entry, realIndent)
    string += this.renderMetadataEntries(entry, realIndent)
    return string
  }

  renderColorValue (entry, indent) {
    var string = this.renderIndent(indent) + entry.value + '\n'
    return string
  }

  renderReference (entry, indent) {
    var string = this.renderIndent(indent) + entry.name + ': =' + entry.refName + '\n'
    string += this.renderMetadataEntries(entry, indent + 1)
    return string
  }

  renderIndent (indent) {
    var out = ''
    var i
    for (i = 0; i < indent; i++) { out += '  ' }
    return out
  }

  findMetaGroups (keys) {
    var groupCounts = {}
    var groups = []
    keys.forEach((key) => {
      var segments = key.split('/')
      if (segments[0] !== '') {
        groupCounts[segments[0]] = (groupCounts[segments[0]] || 0) + 1
      }
      if (groupCounts[segments[0]] && groupCounts[segments[0]] > 1) {
        groups.push(segments[0])
      }
    })
    return groups
  }

  groupMetadata (entry) {
    var keys = entry.metadata.keys()
    var grouped = {}
    var groups = this.findMetaGroups(keys)
    keys.forEach((key) => {
      var segments = key.split('/')
      var first = segments.shift()
      if (groups.indexOf(first) !== -1) {
        grouped[first] = grouped[first] || {}
        grouped[first][segments.join('/')] = entry.metadata.get(key)
      } else {
        grouped[key] = entry.metadata.get(key)
      }
    })
    return grouped
  }

  renderMetaGroups (groups, indent) {
    var out = ''
    if (!groups) {
      return out
    }
    Object.keys(groups).forEach((key) => {
      var value = groups[key]
      if (typeof (value) === 'string' || typeof (value) === 'number') {
        out += this.renderIndent(indent) + key + ': ' + value + '\n'
      } else if (typeof (value) === 'boolean') {
        out += this.renderIndent(indent) + key + ': ' + (value ? 'true' : 'false') + '\n'
      } else if (typeof (value) === 'object' && 'type' in value) {
        if (value.type === 'ColorValue') {
          out += this.renderIndent(indent) + key + ': ' + value.value + '\n'
        } else if (value.type === 'Reference') {
          out += this.renderIndent(indent) + key + ': =' + value.refName + '\n'
        }
      } else {
        out += this.renderIndent(indent) + key + '/\n' + this.renderMetaGroups(value, indent + 1)
      }
    })
    return out
  }

  renderMetadataEntries (entry, indent) {
    if (entry.metadata.keys().length === 0) { return '' }
    var grouped = this.groupMetadata(entry)
    return this.renderMetaGroups(grouped, indent)
  }
  renderChildren (entry, indent) {
    var out = ''
    entry.children.forEach((child) => {
      out += this.getRenderMethod(child.type)(child, indent)
    })
    return out
  }
  getRenderMethod (type) {
    if (this['render' + type]) {
      return this['render' + type].bind(this)
    } else {
      throw new Error('No Render Method for type ' + type + 'found.')
    }
  }

  render () {
    return this.renderPalette(this.root, 0)
  }

}

module.exports = Renderer
