"use strict";
var Parser = require("jison").Parser;
var lexer = require('./lexer');

// myparser.js
var fs = require("fs");
var jison = require("jison");

var bnf = fs.readFileSync("grammar/oco.jison", "utf8");
var jisonparser = new jison.Parser(bnf);
jisonparser.lexer = lexer;

class Color {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class Reference {
  constructor(name, refName) {
    this.name = name;
    this.reference = null;
    this.refName = refName;
  }
}


class Palette {
  constructor(name, children) {
    this.childKeys = {};
    this.name = name;
    this.metadata = {};
    this.children = [];
    this.addChildren(children);
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
    });
  }
  resolveReferences() {
    this.children.forEach(function(child) {
      if (child['resolveReferences']) {
        child.resolveReferences();
      }
      if (child['refName']) { // look ma, it's a reference
        var refPath = child.refName.split(".");
        if (refPath.length == 1) {
          // happy path for poc.
          if ('undefined' !== typeof this.childKeys[refPath[0]]) { // index could be 0 which is falsy in JS. Yay.
            console.log(this.childKeys[refPath[0]], refPath[0]);
            child.reference = this.children[this.childKeys[refPath[0]]];
          }
        }
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
  o: (object) => { console.log("O", object); }
}

var parser = {
  parse(data) {
    var tree = jisonparser.parse(data);
    tree.resolveReferences();
    return tree;
  }
}


module.exports = parser;
