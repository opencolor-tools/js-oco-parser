"use strict";
const color_helpers_1 = require("./color_helpers");
class HexColorString {
    constructor(_value) {
        this._value = _value;
    }
    toString() {
        return this._value;
    }
}
class ColorEntryValue {
    static isRGBExpressable(entryValue) {
        if ((entryValue instanceof ColorValue)) {
            return ColorValue.isRGBExpressable(entryValue);
        }
        if ((entryValue instanceof ColorValueList)) {
            return entryValue.values.filter(value => ColorValue.isRGBExpressable(value)).length > 0;
        }
        return false;
    }
    toString(level) { return ''; }
}
exports.ColorEntryValue = ColorEntryValue;
class ColorValueList extends ColorEntryValue {
    constructor(_values) {
        super();
        this._values = _values;
    }
    get values() {
        return this._values;
    }
    toString(level) { return this._values.map(v => v.toString(level)).join(', '); }
}
exports.ColorValueList = ColorValueList;
class ColorValue extends ColorEntryValue {
    static fromString(colorString) {
        return new HexColorValue(colorString);
    }
    static isRGBExpressable(value) {
        return 'hexString' in value;
    }
    toString(level) { return ''; }
}
exports.ColorValue = ColorValue;
class IdentifiedColorValue extends ColorValue {
    constructor(space) {
        super();
        this.space = space;
    }
}
class GenericColorValue extends ColorValue {
}
class HexColorValue extends IdentifiedColorValue {
    constructor(_hexString) {
        super('hex');
        this._hexString = _hexString;
    }
    get hexString() {
        return new HexColorString(this._hexString);
    }
    toString(level) {
        return this.hexString.toString();
    }
}
exports.HexColorValue = HexColorValue;
class RGBColorValue extends IdentifiedColorValue {
    constructor(r, g, b) {
        super('rgb');
        this.r = r;
        this.g = g;
        this.b = b;
    }
    get hexString() {
        return new HexColorString(color_helpers_1.rgb2hex(this.r, this.g, this.b));
    }
}
exports.RGBColorValue = RGBColorValue;
class RGBAColorValue extends IdentifiedColorValue {
    constructor(r, g, b, a) {
        super('rgba');
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    get hexString() {
        return new HexColorString(color_helpers_1.rgb2hex(this.r, this.g, this.b));
    }
}
exports.RGBAColorValue = RGBAColorValue;
class CMYKColorValue extends IdentifiedColorValue {
    constructor(c, m, y, k) {
        super('cmyk');
        this.c = c;
        this.m = m;
        this.y = y;
        this.k = k;
    }
}
exports.CMYKColorValue = CMYKColorValue;
