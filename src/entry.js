/* jshint -W097 */
'use strict';

var Reference = require('./reference');
var ColorValue = require('./color_value');

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
    this.name = name || 'Root';
    this.position = position;
    this.metadata = {};
    this.children = [];
    this.childKeys = {};
    this.parent = null;
    this.type = type || ((this.name === 'Root') ? 'Root' : 'Entry');
    this.addChildren(flatten(children || []), false);
    this.validateType();
    this.forEach = Array.prototype.forEach.bind(this.children); // the magic of JavaScript.

  }
  get(nameOrIndex) {
    if ('string' === typeof nameOrIndex) {
      return this.children[this.childKeys[nameOrIndex]];
    } else {
      return this.children[nameOrIndex];
    }
  }

  addParent(element) {
    if (element['refName']) {
      element.parent = this;
    }
  }

  addMetadata(metadata) {
    Object.keys(metadata).forEach((key) => {
      if (!key.match(/\//)) {
        throw("Metadata keys must contain at least one slash. (Failed at ''" + key + "')");
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

  addChild(child, validate=true) {
    if (!child) { return; }
    //console.log("add child", child);
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
      if ('undefined' !== typeof this.childKeys[child.name]) { // name collision. just overwrite as yaml would probably do.
        this.children[this.childKeys[child.name]] = child;
      } else {
        var newIndex = this.children.length;
        this.children.push(child);
        this.childKeys[child.name] = newIndex;
      }
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
      let type = child.constructor.name;
      if (types.indexOf(type) === -1) { types.push(type); }
    });
    types = types.sort();
    if (types.indexOf('ColorValue') !== -1 && types.indexOf('Color') !== -1 ) {
      throw('Entry "' + this.name + '" cannot contain colors and color values at the same level (line: ' + this.position.first_line + ')');
    }
    if (types.indexOf('Entry') !== -1 && types.indexOf('ColorValue') !== -1) {
      throw('Entry "' + this.name + '" cannot contain palette and color values at the same level (line: ' + this.position.first_line + ')');
    }
    if (types.indexOf('ColorValue') !== -1 && this.type === 'Entry') {
      this.type = 'Color';
    }
  }
}

module.exports = Entry;
