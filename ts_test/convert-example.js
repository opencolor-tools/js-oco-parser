/* jshint -W097 */
'use strict';
var expect = require('chai').expect;

import {Entry} from '../ts_lib/entry'
import {Metadata} from '../ts_lib/metadata'
import {PaletteEntry} from '../ts_lib/palette_entry'
import {PaletteEntryValue} from '../ts_lib/palette_value'
import {ColorEntry} from '../ts_lib/color_entry'
import {ColorValue, ColorValueList, RGBColorValue, RGBAColorValue, CMYKColorValue} from '../ts_lib/color_value'
import {ReferenceEntry} from '../ts_lib/reference_entry'
import {ReferenceValue} from '../ts_lib/reference_value'

describe('Converter Example', () => {
it('#api calls example, not a test', () => {

var fs = require('fs');
var less = fs.readFileSync(__dirname + '/bootstrap-variables.less', 'utf-8');
var gonzales = require('gonzales-pe')
var Color = require('color')

var colorNameProcessor = function(name) {
  name = name.replace('$', '');
  var parts = name.split('-');
  var firstName = parts.shift();
  if(!parts.length) {
    return firstName;
  }
  return `${firstName}.${parts.join(' ')}`;
}

// lib-api
var palette = new PaletteEntry('');
var parseTree = gonzales.parse(less, {syntax: 'less', rule: 'declaration'});

var name = null;
parseTree.traverseByTypes(['ident', 'color'], function(node, index, parent) {
  if (node.is('ident')) {
    name = node.content;
    return;
  }
  if (name && node.is('color')) {

    var colorValue = Color('#' + node.content).hexString();
    var dotPath = colorNameProcessor(name);
    // lib-api
    var entry = palette.set(dotPath, new ColorValue.fromString(colorValue));
    // lib-api
    entry.metadata.set('less/variable', '@' + name);

    name = null;
    return;
  }
});

// lib-api
var ocoString = palette.toString();
console.log(ocoString);

palette.set('input.refTest', new ReferenceValue('code.color'));
palette.get('input').metadata.set('group/shit', 'asd');

console.log(' ');
console.log('--- toString')
console.log(' ');
console.log(palette.get('input').toString());

console.log(' ');
console.log('--- refrence');
console.log(' ');
console.log(palette.get('input.refTest').resolvedEntry.hexString);
console.log(palette.get('input.refTest').metadata);

console.log(' ');
console.log('--- traversing')
console.log(' ');
palette.get('input').traverseTree(null, (e) => {
  console.log(e.dotPath, e.value.toString());
})

console.log(' ');
expect(true).to.equal(true);

});
});
