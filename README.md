# Open Color Library

A node module to parse, render and interpret Open Color Format.

Build-Status: ![Build Status](https://travis-ci.org/opencolor-tools/js-oco-parser.svg)

## Install

npm install opencolor

## Examples

Parsing and rendering OCO formats in node.js

```JavaScript
var oco = require('opencolor');

var tree = oco.parse(string); // gives you a tree of the parsed OCO data

var out = oco.render(tree); // outputs a valid oco file of the tree
```

## Branch ts

```
npm run testts
```
