"use strict";
import {Entry} from './entry'
import {Metadata} from './metadata'
import {PaletteEntry} from './palette_entry'
import {PaletteEntryValue} from './palette_value'
import {ColorEntry} from './color_entry'
import {ColorValue, ColorValueList, RGBColorValue, RGBAColorValue, CMYKColorValue} from './color_value'
import {ReferenceEntry} from './reference_entry'
import {ReferenceValue} from './reference_value'


export const oco = {
  PaletteEntry,
  PaletteEntryValue,
  ColorEntry,
  ColorValue, ColorValueList, RGBColorValue, RGBAColorValue, CMYKColorValue,
  ReferenceEntry,
  ReferenceValue,
  Metadata
}
