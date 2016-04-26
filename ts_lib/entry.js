"use strict";
const metadata_1 = require("./metadata");
class Entry {
    constructor(_name, _value, _parent) {
        this._name = _name;
        this._value = _value;
        this._parent = _parent;
        this._metadata = null;
        this._metadata = new metadata_1.Metadata();
    }
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
    get parent() {
        return this._parent;
    }
    set parent(newParent) {
        if (newParent == this) {
            return;
        }
        this._parent = newParent;
    }
    get dotPath() {
        if (!this._parent) {
            return this.name;
        }
        return [this._parent.dotPath, this.name].filter(s => s != '').join('.');
    }
    get value() {
        return this._value;
    }
    set value(newValue) {
        this._value = newValue;
    }
    get metadata() {
        return this._metadata;
    }
    set metadata(newMetadata) {
        this._metadata = newMetadata;
    }
    toString(level = 0) {
        let result = `${this._name}: ${this._value.toString(level)}`;
        if (this.metadata.isEmpty()) {
            return result;
        }
        result += this.metadata.toString(level + 1);
        return result;
    }
}
exports.Entry = Entry;
