"use strict";
const entry_1 = require("./entry");
const palette_value_1 = require("./palette_value");
const color_entry_1 = require("./color_entry");
const color_value_1 = require("./color_value");
const reference_entry_1 = require("./reference_entry");
const reference_value_1 = require("./reference_value");
class PaletteEntry extends entry_1.Entry {
    constructor(_name, _value, _parent) {
        if (!_value) {
            _value = new palette_value_1.PaletteEntryValue();
        }
        super(_name, _value, _parent);
        _value.entries.forEach((entry) => {
            entry.parent = this;
        });
    }
    set(dotPath, value) {
        const pathParts = dotPath.split('.');
        const firstPathPart = pathParts.shift();
        let existingEntry = this._value.getEntryByName(firstPathPart);
        if (!pathParts.length) {
            let newEntry = PaletteEntry.createEntry(firstPathPart, value, this);
            if (existingEntry) {
                this._value.replaceEntry(existingEntry, newEntry);
            }
            else {
                this._value.addEntry(newEntry);
            }
            return newEntry;
        }
        if (existingEntry && existingEntry instanceof PaletteEntry) {
            return existingEntry.set(pathParts.join('.'), value);
        }
        let newGroup = new PaletteEntry(firstPathPart, null, this);
        this._value.addEntry(newGroup);
        return newGroup.set(pathParts.join('.'), value);
    }
    get(dotPath) {
        const pathParts = dotPath.split('.');
        if (!pathParts.length) {
            return undefined;
        }
        const firstPathPart = pathParts.shift();
        if (!pathParts.length) {
            return this._value.getEntryByName(firstPathPart);
        }
        const paletteEntry = this._value.getEntryByNameAndType(firstPathPart, PaletteEntry);
        if (!paletteEntry) {
            return undefined;
        }
        return paletteEntry.get(pathParts.join('.'));
    }
    traverseTree(filterByTypes, callback) {
        this._value.entries.forEach(function (entry) {
            if (!filterByTypes || filterByTypes.length || filterByTypes.filter(type => (entry instanceof type)).length) {
                callback.apply(this, [entry]);
            }
            if ((entry instanceof PaletteEntry)) {
                entry.traverseTree(filterByTypes, callback);
            }
        });
    }
    toString(level = 0) {
        level++;
        if (this.metadata.isEmpty()) {
            return `${this.name}: ${this._value.toString(level)}`;
        }
        return `${this.name}: ${this.metadata.toString(level)} ${this._value.toString(level)}`;
    }
    static createEntry(name, value, parent) {
        if (value instanceof color_value_1.ColorEntryValue) {
            return new color_entry_1.ColorEntry(name, value, parent);
        }
        if (value instanceof reference_value_1.ReferenceValue) {
            return new reference_entry_1.ReferenceEntry(name, value, parent);
        }
        if (value instanceof palette_value_1.PaletteEntryValue) {
            return new PaletteEntry(name, value, parent);
        }
        return null;
    }
}
exports.PaletteEntry = PaletteEntry;
