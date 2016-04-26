"use strict";
class PaletteEntryValue {
    constructor(_entries) {
        this._entries = _entries;
        if (!_entries) {
            this._entries = [];
        }
    }
    get entries() {
        return this._entries;
    }
    addEntry(newEntry) {
        this._entries.push(newEntry);
    }
    replaceEntry(existingEntry, newEntry) {
        var index = this._entries.indexOf(existingEntry);
        if (index !== -1) {
            this._entries[index] = newEntry;
        }
    }
    getEntryByName(name) {
        let entries = this._entries.filter((e) => {
            return e.name == name;
        });
        return entries.pop();
    }
    getEntryByNameAndType(name, type) {
        let entries = this._entries.filter((e) => {
            return e.name == name && e instanceof type;
        });
        return entries.pop();
    }
    toString(level) {
        return [''].concat(this._entries.map(e => e.toString(level))).join('\n' + '  '.repeat(level));
    }
}
exports.PaletteEntryValue = PaletteEntryValue;
