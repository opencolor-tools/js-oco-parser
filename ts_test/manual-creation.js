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

describe('RGBColorValue', () => {
  var value = new RGBColorValue(255, 0, 0);
  it('#r', () => {
    expect(value.r).to.equal(255);
  });
  it('#b', () => {
    expect(value.b).to.equal(0);
  });
  it('#g', () => {
    expect(value.g).to.equal(0);
  });
  xit('#isRGBExpressable', () => {
    expect(ColorValue.isRGBExpressable(RGBColorValue)).to.equal(true);
  });
});

describe('Color', () => {

  var value = new RGBColorValue(255, 0, 0);
  var entry = new ColorEntry('red', value);
  it('#name', () => {
    expect(entry.name).to.equal('red');
  });
  it('#value', () => {
    expect(entry.value).to.equal(value);
  });
  it('#hexString', () => {
    expect(entry.hexString.toString()).to.equal('#FF0000');
  });

});

describe('Reference', () => {

  describe('resolving in same scope', () => {

    var entry = new ColorEntry('red', new RGBColorValue(255, 0, 0));
    var reference = new ReferenceEntry('redRef', new ReferenceValue('red'));
    let root = new PaletteEntry('root', new PaletteEntryValue([entry, reference]));

    it('#resolveEntry', () => {
      expect(root.get('redRef').resolvedEntry).to.equal(entry);
    });

    it('#resolvedEntries', () => {
      expect(root.get('redRef').resolvedEntries[0]).to.equal(entry);
    });

  });

  describe('not resolve circular references', () => {

    var reference = new ReferenceEntry('redRef', new ReferenceValue('redRed'));
    let root = new PaletteEntry('root', new PaletteEntryValue([reference]));

    it('#resolveEntry', () => {
      expect(root.get('redRef').resolvedEntry).to.be.undefined;
    });

    it('#resolvedEntries', () => {
      expect(root.get('redRef').resolvedEntries).to.have.length(0);
    });

  });

  describe('resolving in parent scope', () => {

    var entry = new ColorEntry('red', new RGBColorValue(255, 0, 0));
    var reference = new ReferenceEntry('redRef', new ReferenceValue('red'));
    let group = new PaletteEntry('group', new PaletteEntryValue([reference]))
    let root = new PaletteEntry('root', new PaletteEntryValue([entry, group]));

    it('#resolveEntry', () => {
      expect(root.get('group.redRef').resolvedEntry).to.equal(entry);
    });

    it('#resolvedEntries', () => {
      expect(root.get('group.redRef').resolvedEntries[0]).to.equal(entry);
    });

  });

  describe('resolving in other group', () => {

    var entry = new ColorEntry('red', new RGBColorValue(255, 0, 0));
    var reference = new ReferenceEntry('redRef', new ReferenceValue('group.red'));
    let group = new PaletteEntry('group', new PaletteEntryValue([entry]))
    let otherGroup = new PaletteEntry('otherGroup', new PaletteEntryValue([reference]))
    let root = new PaletteEntry('root',  new PaletteEntryValue([group, otherGroup]));

    it('#resolveEntry', () => {
      expect(root.get('otherGroup.redRef').resolvedEntry).to.equal(entry);
      expect(root.get('otherGroup.redRef').resolvedEntry.hexString.toString()).to.equal('#FF0000');
    });

    it('#resolvedEntries', () => {
      expect(root.get('otherGroup.redRef').resolvedEntries[0]).to.equal(entry);
    });

  });

  describe('resolving via one other reference', () => {

    var entry = new ColorEntry('red', new RGBColorValue(255, 0, 0));
    var reference = new ReferenceEntry('redRef', new ReferenceValue('group.red'));
    var referenceToReference = new ReferenceEntry('redRefRef', new ReferenceValue('otherGroup.redRef'));
    let group = new PaletteEntry('group', new PaletteEntryValue([entry]))
    let otherGroup = new PaletteEntry('otherGroup', new PaletteEntryValue([reference]))
    let thirdGroup = new PaletteEntry('thirdGroup', new PaletteEntryValue([referenceToReference]))
    let root = new PaletteEntry('root', new PaletteEntryValue([group, otherGroup, thirdGroup]));

    it('#resolveEntry', () => {
      expect(root.get('thirdGroup.redRefRef').resolvedEntry).to.equal(entry);
    });

    it('#resolvedEntries', () => {
      expect(root.get('thirdGroup.redRefRef').resolvedEntries).to.have.length(2);
      expect(root.get('thirdGroup.redRefRef').resolvedEntries[0]).to.equal(reference);
      expect(root.get('thirdGroup.redRefRef').resolvedEntries[1]).to.equal(entry);
    });

  });

  describe('should use metadata of referenced entries', () => {

    var entry = new ColorEntry('red', new RGBColorValue(255, 0, 0));
    entry.metadata = Metadata.fromObject({'key1': 'value1', 'key2': 'tobechanged', 'key3': 'tobechanged'});
    var reference = new ReferenceEntry('redRef', new ReferenceValue('group.red'));
    reference.metadata = Metadata.fromObject({'key2': 'changedvalue', 'key3': 'changedvalue', 'key4': 'added'});
    var referenceToReference = new ReferenceEntry('redRefRef', new ReferenceValue('otherGroup.redRef'));
    referenceToReference.metadata = Metadata.fromObject({'key3': 'changedtwice', 'key5': 'addedvalue'});
    let group = new PaletteEntry('group', new PaletteEntryValue([entry]))
    let otherGroup = new PaletteEntry('otherGroup', new PaletteEntryValue([reference]))
    let thirdGroup = new PaletteEntry('thirdGroup', new PaletteEntryValue([referenceToReference]))
    let root = new PaletteEntry('root', new PaletteEntryValue([group, otherGroup, thirdGroup]));

    it('#metadata', () => {
      expect(root.get('group.red').metadata.toObject()).to.have.keys(['key1', 'key2', 'key3']);
      expect(root.get('otherGroup.redRef').metadata.toObject()).to.have.keys(['key1', 'key2', 'key3', 'key4']);

      var metadata = root.get('thirdGroup.redRefRef').metadata.toObject();
      expect(metadata).to.have.keys(['key1', 'key2', 'key3', 'key4', 'key5']);
      expect(metadata['key1']).to.equal('value1');
      expect(metadata['key2']).to.equal('changedvalue');
      expect(metadata['key3']).to.equal('changedtwice');
    });

  });

})

describe('Palette', () => {

  var red = new ColorEntry('red', new RGBColorValue(255, 0, 0));
  red.metadata = Metadata.fromObject({'oct/view': 'foo'});

  var redRef = new ReferenceEntry('redRef', new ReferenceValue('red'));
  var blue = new ColorEntry('blue', new RGBAColorValue(255, 0, 0, 100));
  var blue1 = new ColorEntry('blue 100', new RGBAColorValue(255, 110, 0, 100));
  var blue2 = new ColorEntry('blue 200', new RGBAColorValue(255, 110, 0, 100));
  var blue3 = new ColorEntry('blue 300 cmyk', new CMYKColorValue(99, 0, 0, 100));
  var blue4 = new ColorEntry('blue 300 cmyk',
    new ColorValueList([
      new CMYKColorValue(99, 0, 0, 100),
      new CMYKColorValue(99, 0, 50, 100)
    ])
  );
  var blues = new PaletteEntryValue([blue, blue1, blue2, blue3, blue4]);
  let bluesGroup = new PaletteEntry('blues', blues)

  var rootEntries = new PaletteEntryValue([red, redRef, blue, bluesGroup]);
  let root = new PaletteEntry('root', rootEntries);

  it('#name', () => {
    expect(root.name).to.equal('root');
  });
  it('#value', () => {
    expect(root.value).to.equal(rootEntries);
  });
  it('#get', () => {
    expect(root.get('red')).to.equal(red);
    expect(root.get('redRef')).to.equal(redRef);
    expect(root.get('asdasdasd')).to.be.undefined;
    expect(root.get('blues.blue')).to.equal(blue);
    expect(root.get('blues')).to.deep.equal(bluesGroup);
  });

  it('#traverseTree', () => {
    bluesGroup.traverseTree([ColorEntry], function(e) {
        expect(e).to.be.instanceof(ColorEntry);
    });
    var countColorEntries = 0;
    bluesGroup.traverseTree([ColorEntry], function(e) {
        countColorEntries++;
    });
    expect(countColorEntries).to.equal(5);

    var countPaletteEntries = 0;
    root.traverseTree([PaletteEntry], function(e) {
        countPaletteEntries++;
    });
    expect(countPaletteEntries).to.equal(1);

    var countAll = 0;
    root.traverseTree([], function(entry) {
      console.log(entry);
        countAll++;
    });
    expect(countAll).to.equal(9);
  });

});
