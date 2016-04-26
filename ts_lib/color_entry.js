"use strict";
const entry_1 = require("./entry");
const color_value_1 = require("./color_value");
class ColorEntry extends entry_1.Entry {
    constructor(_name, _value, _parent) {
        super(_name, _value, _parent);
    }
    get value() {
        return this._value;
    }
    get hexString() {
        if (color_value_1.ColorEntryValue.isRGBExpressable(this._value)) {
            return this._value.hexString;
        }
        return null;
    }
}
exports.ColorEntry = ColorEntry;
