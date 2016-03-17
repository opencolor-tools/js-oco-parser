"use strict";
var Parser = require("jison").Parser;
var lexer = require('./lexer');

// myparser.js
var fs = require("fs");
var jison = require("jison");

var bnf = fs.readFileSync("grammar/oco.jison", "utf8");
var parser = new jison.Parser(bnf);
parser.lexer = lexer;

class Color {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    console.log("new color", this.name, this.value);
  }
}

class Palette {
  constructor(name, children) {
    this.name = name;
    this.metadata = {};
    this.colors = {};
    this.palettes = {};
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
      }
      if (type == 'Metadata') {
        this.metadata[child.name] = child;
      }
    });
  }
}

class Metadata {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    console.log("new metadata", this.name, this.value);
  }
}
parser.yy = {
  Color: Color,
  Palette: Palette,
  Metadata: Metadata,
  o: (object) => { console.log("O", object); }
}

module.exports = parser;
