"use strict";
import {Entry} from "./entry";
import {ColorEntryValue, RGBExpressable} from "./color_value";

export class ColorEntry extends Entry {
  constructor(_name: string, _value: ColorEntryValue, _parent?: Entry) {
    super(_name, _value, _parent);
  }
  get value():ColorEntryValue {
    return this._value;
  }
  get hexString() {
    if (ColorEntryValue.isRGBExpressable(this._value)) {
      return (<RGBExpressable>this._value).hexString;
    }
    return null;
  }
}
