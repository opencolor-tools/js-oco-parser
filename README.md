# Open Color Library

A node module to parse, render and interpret Open Color Format.

Build Status: [![Build Status](https://travis-ci.org/opencolor-tools/opencolor-js.svg?branch=master)](https://travis-ci.org/opencolor-tools/opencolor-js)

## Install

npm install opencolor

## Examples

### Parsing and rendering OCO formats.

```JavaScript
var oco = require('opencolor');

var tree = oco.parse(string); // gives you a tree of the parsed OCO data

var out = oco.render(tree); // outputs a valid oco file of the tree
```

### Creating OCO programmatically

```JavaScript
var oco = require('opencolor');

 // creates a root object
var tree = new oco.Entry();

// create a named color from a hex color
var color = new oco.Entry('super color', [oco.ColorValue.fromColorValue('#ff0')], 'Color');
var group = new oco.Entry('group', [color]);
// set some metadata on the group
group.addMetadata({'author/name': 'Jan Krutisch'});
tree.addChild(group);

var out = oco.render(tree); // outputs a valid oco file of the tree
```

We're going to add more thorough Documentation soon!
