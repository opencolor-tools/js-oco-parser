"use strict";
const metadata_1 = require('./metadata');
const palette_entry_1 = require('./palette_entry');
const palette_value_1 = require('./palette_value');
const color_entry_1 = require('./color_entry');
const color_value_1 = require('./color_value');
const reference_entry_1 = require('./reference_entry');
const reference_value_1 = require('./reference_value');
exports.oco = {
    PaletteEntry: palette_entry_1.PaletteEntry,
    PaletteEntryValue: palette_value_1.PaletteEntryValue,
    ColorEntry: color_entry_1.ColorEntry,
    ColorValue: color_value_1.ColorValue, ColorValueList: color_value_1.ColorValueList, RGBColorValue: color_value_1.RGBColorValue, RGBAColorValue: color_value_1.RGBAColorValue, CMYKColorValue: color_value_1.CMYKColorValue,
    ReferenceEntry: reference_entry_1.ReferenceEntry,
    ReferenceValue: reference_value_1.ReferenceValue,
    Metadata: metadata_1.Metadata
};
