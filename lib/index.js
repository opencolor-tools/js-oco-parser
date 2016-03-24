"use strict";
var Parser = require("jison").Parser;
var lexer = require('./lexer');

// myparser.js
var fs = require("fs");
var jison = require("jison");

var bnf = fs.readFileSync(__dirname + "/../grammar/oco.jison", "utf8");
var jisonparser = new jison.Parser(bnf);
jisonparser.lexer = lexer;

class Color {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.parent = null;
  }
}

class Reference {
  constructor(name, refName) {
    this.name = name;
    this.reference = null;
    this.refName = refName;
    this.parent = null;
  }
}


class Palette {
  constructor(name, children) {
    this.name = name;
    this.metadata = {};
    this.children = [];
    this.childKeys = {};
    this.parent = null;
    this.addChildren(children);
    this.forEach = Array.prototype.forEach.bind(this.children); // the magic of JavaScript.
  }
  get(nameOrIndex) {
    if ('string' === typeof nameOrIndex) {
      return this.children[this.childKeys[nameOrIndex]];
    } else {
      return this.children[nameOrIndex];
    }
  }
  addChildren(children) {
    children.forEach((child) => {
      var type = child.constructor.name;
      // we're basically only separating meta data.
      if (type == 'Metadata') {
        this.metadata[child.name] = child;
      } else {
        if ('undefined' !== typeof this.childKeys[child.name]) { // name collision. just overwrite as yaml would probably do.
          this.children[this.childKeys[child.name]] = child;
        } else {
          var newIndex = this.children.length;
          this.children.push(child);
          this.childKeys[child.name] = newIndex;
        }
      }
      child.parent = this;
    });
  }

  resolve(current, path, notUp) {
    // console.log("RESOLVE", current, path, notUp);
    var resolved = current.get(path[0]);
    if (resolved) {
      if (path.length > 1) {
        resolved = this.resolve(resolved, path.slice(1), true);
      }
      if (resolved) {
        return resolved;
      }
    }
    if (current.parent && !notUp) {
      return this.resolve(current.parent, path);
    } else {
      return null;
    }
  }

  resolveReferences() {
    this.children.forEach(function(child) {
      if (child['resolveReferences']) {
        child.resolveReferences();
      }
      if (child['refName']) { // look ma, it's a reference
        var refPath = child.refName.split(".");
        child.reference = this.resolve(this, refPath);
      }
    }, this);
  }
}

class Metadata {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}
jisonparser.yy = {
  Color: Color,
  Palette: Palette,
  Metadata: Metadata,
  Reference: Reference,
  log: (object) => { console.log(JSON.stringify(object, false, ' ')); }
}

var parser = {
  parse(data) {
    var tree = jisonparser.parse(data);
    tree.resolveReferences();
    return tree;
  }
}


module.exports = parser;
