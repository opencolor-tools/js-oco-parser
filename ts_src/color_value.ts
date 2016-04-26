"use strict";
import {EntryValue} from "./entry_value";
import {rgb2hex} from "./color_helpers";

class HexColorString {
  constructor(private _value: string) {}
  toString(): string {
    return this._value;
  }
}

export interface RGBExpressable {
    hexString: HexColorString;
}

export abstract class ColorEntryValue implements EntryValue {

  static isRGBExpressable(entryValue: ColorEntryValue): boolean {
    if((entryValue instanceof ColorValue)) {
      return ColorValue.isRGBExpressable(entryValue);
    }
    if((entryValue instanceof ColorValueList)) {
      return (<ColorValueList>entryValue).values.filter(value => ColorValue.isRGBExpressable(value)).length > 0;
    }
    return false;
  }

  toString(level: number):string { return '' }
}

export class ColorValueList extends ColorEntryValue {
  constructor(private _values: Array<ColorValue>) {
    super();
  }
  get values() {
    return this._values;
  }
  toString(level: number):string { return this._values.map(v => v.toString(level)).join(', ') }
}

export abstract class ColorValue extends ColorEntryValue {
  static fromString(colorString: string): ColorValue {
    return new HexColorValue(colorString);
  }
  static isRGBExpressable(value: any): value is RGBExpressable {
    return 'hexString' in value;
  }
  toString(level: number):string { return '' }
}

class IdentifiedColorValue extends ColorValue {
  constructor(protected space: string) { super() }
}

class GenericColorValue extends ColorValue {

}

export class HexColorValue extends IdentifiedColorValue implements RGBExpressable  {
  constructor(private _hexString: string) {
    super('hex');
  }
  get hexString(): HexColorString {
    return new HexColorString(this._hexString);
  }
  toString(level: number):string {
    return this.hexString.toString();
  }
}

export class RGBColorValue extends IdentifiedColorValue implements RGBExpressable  {
  constructor(public r: number, public g: number, public b: number) {
    super('rgb');
  }
  get hexString() :HexColorString {
    return new HexColorString(rgb2hex(this.r, this.g, this.b));
  }
}

export class RGBAColorValue extends IdentifiedColorValue implements RGBExpressable  {
  constructor(public r: number, public g:number, public b:number, public a:number) {
    super('rgba');
  }
  get hexString() :HexColorString {
    return new HexColorString(rgb2hex(this.r, this.g, this.b));
  }
}

export class CMYKColorValue extends IdentifiedColorValue {
  constructor(public c: number, public m:number, public y:number, public k:number) {
    super('cmyk');
  }
}
