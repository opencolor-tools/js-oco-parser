/* jshint -W097 */
'use strict';

var Reference = require('./reference');
var ColorValue = require('./color_value');
var ParserError = require('./parser_error');

function flatten(ary) {
  var ret = [];
  for(var i = 0; i < ary.length; i++) {
    if(Array.isArray(ary[i])) {
      ret = ret.concat(flatten(ary[i]));
    } else {
      ret.push(ary[i]);
    }
  }
  return ret;
}

class Entry {
  constructor(name, children, type, position) {
    this._name = name || 'Root';
    this.position = position;
    this.metadata = {};
    this.children = [];
    this.parent = null;
    this.type = type || 'Palette';

    this.addChildren(flatten(children || []), false);
    this.validateType();
    this.forEach = Array.prototype.forEach.bind(this.children); // the magic of JavaScript.
  }
  set name(newName) {
    this._name = newName.replace(/\./g, '');
  }
  get name() {
    return this._name;
  }
  get(nameOrIndex) {
    if ('string' === typeof nameOrIndex) {
      if (nameOrIndex.match(/\./)) { // dotpath, so we need to do a deep lookup
        var pathspec = nameOrIndex.split(".");
        return this.get(pathspec.shift()).get(pathspec.join("."));
      }
      return this.children.filter((child) => child.name === nameOrIndex).pop();
    } else {
      return this.children[nameOrIndex];
    }
  }

  remove(path) {
    var entry = this.get(path);
    if(!entry) {
      return;
    }
    entry.parent.removeChild(entry);
    // if there are multiple children with the same dotpath
    this.remove(path);
  }

  set(nameOrIndex, value) {
    if ('string' === typeof nameOrIndex) {
      if (nameOrIndex.match(/\./)) { // dotpath, so we need to do a deep lookup
        var pathspec = nameOrIndex.split(".");
        var firstPart = pathspec.shift();
        var existingEntry =  this.get(firstPart);
        if (existingEntry && existingEntry.type === 'Palette') {
          existingEntry.set(pathspec.join("."), value);
        } else {
          var newGroup = new Entry(firstPart);
          this.set(firstPart, newGroup);
          newGroup.set(pathspec.join("."), value);
        }
      } else {
        if (this.get(nameOrIndex)) {
          this.get(nameOrIndex).parent = null; // nullifying ref
          this.children.filter((child) => child.name === nameOrIndex).forEach((child) => {
            child.value = value;
          });
          value.name = nameOrIndex;
        } else {
          this.children.push(value);
          value.name = nameOrIndex;
        }
        value.parent = this;
      }
    } else {
      if (this.children[nameOrIndex]) {
        this.children[nameOrIndex].parent = null; // nullifying reference
      }
      this.children[nameOrIndex] = value;
      value.parent = this;
    }
  }

  path() {
    if (!this.parent) { return ''; } // we don't actually want to have the root in there.
    return [this.parent.path(), this.name].filter((e) => e !== '').join('.');
  }

  addParent(element) {
    if (element['refName']) {
      element.parent = this;
    }
  }

  addMetadata(metadata) {
    Object.keys(metadata).forEach((key) => {
      if (!key.match(/\//)) {
        throw(new ParserError("Metadata keys must contain at least one slash. (Failed at ''" + key + "')"), {});
      }
      if (typeof(metadata[key]) === 'string') {
        if (metadata[key].match(/^=/)) {
          // shortcut for creating references
          var name = metadata[key].slice(1).trim();
          metadata[key] = new Reference('metachild', name);
        } else if (metadata[key].match(/^#([a-fA-F0-9]){3,8}/) || metadata[key].match(/^rgba?\(.*\)$/)) {
          // shortcut for creating colors
          metadata[key] = ColorValue.fromColorValue(metadata[key]);
        }
      }
      this.metadata[key] = metadata[key];
      this.addParent(this.metadata[key]);
    });
  }

  removeChild(child) {
    var index = this.children.indexOf(child);
    this.children = this.children.slice(0, index).concat(this.children.slice(index + 1));
  }

  addChild(child, validate=true) {
    if (!child) { return; }
    var type = child.type;
    // we're basically only separating meta data.
    if (type === 'Metadata') {
      this.metadata[child.name] = child.value;
      this.addParent(this.metadata[child.name]);
    } else if (type === 'Metablock') {
      var prefix = child.name + "/";
      Object.keys(child.metadata).forEach((key) => {
        var combinedKey = (prefix + key).replace(/\/\//g, '/'); // normalize keys
        this.metadata[combinedKey] = child.metadata[key];
        this.addParent(this.metadata[combinedKey]);
      });
    } else {
      this.children.push(child);
      child.parent = this;
    }

    if (validate) {
      this.validateType();
    }
  }

  addChildren(children) {
    children.forEach((child) => { this.addChild(child, false); }, this);
  }

  validateType() {
    var types = [];
    this.children.forEach((child) => {
      let type = child.type;
      if (types.indexOf(type) === -1) { types.push(type); }
    });
    types = types.sort();
    if (types.indexOf('ColorValue') !== -1 && types.indexOf('Color') !== -1 ) {
      let message = `Palette "${this.name}" cannot contain colors and color values at the same level (line: ${this.position.first_line - 1})`;
      throw(new ParserError(message, {line: this.position.first_line }));
    }
    if (types.indexOf('Palette') !== -1 && types.indexOf('ColorValue') !== -1) {
      let message = `Palette "${this.name}" cannot contain palette and color values at the same level (line: ${this.position.first_line - 1})`;
      throw(new ParserError(message, {line: this.position.first_line }));
    }
    if (types.indexOf('ColorValue') !== -1 && this.type === 'Palette') {
      this.type = 'Color';
    }
  }

  traverseTree(filters, callback) {
    var filter = false;
    if (typeof filters === 'string') { filters = [filters]; }
    if (filters && filters.length > 0) { filter = true; }
    this.children.forEach((child) => {
      if (child.type !== 'ColorValue' && (!filter || filters.indexOf(child.type) !== -1)) {
        callback(child);
      }
      if (child.children && child.children.length > 0) {
        child.traverseTree(filters, callback);
      }
    });
  }

  hexcolor(withAlpha = false) {
    if (this.type !== 'Color') { return null; }
    var identifiedColor = this.children.filter((child) => child.identified === true)[0];
    if (identifiedColor) { return identifiedColor.hexcolor(withAlpha); }
    return null;
  }

  clone() {
    var children = this.children.map((child) => child.clone());
    var clone = new Entry(this.name, children, this.type, this.position);
    clone.metadata = this.metadata;
    return clone;
  }

}

module.exports = Entry;
