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
    this.name = name;
    this.metadata = {};
    this.colors = {};
    this.palettes = {};
    this.references = {};
    this.parent = null;
    this.addChildren(children);
  }
  addChildren(children) {
    children.forEach((child) => {
      var type = child.constructor.name;
      if (type == 'Color') {
        this.colors[child.name] = child;
      }
      if (type == 'Palette') {
        this.palettes[child.name] = child;
        child.parent = this;
      }
      if (type == 'Metadata') {
        this.metadata[child.name] = child;
      }
      if (type == 'Reference') {
        this.references[child.name] = child;
      }
    });
  }
  resolveReferences() {
    Object.keys(this.palettes).forEach(function(key) {
      this.palettes[key].resolveReferences();
    }, this);
    Object.keys(this.references).forEach(function(key) {
      var ref = this.references[key];
      var refPath = ref.refName.split(".");
      if (refPath.length == 1) {
        // happy path for poc.
        ref.reference = this.colors[refPath[0]] || this.palettes[refPath[0]];
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
