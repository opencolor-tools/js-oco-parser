"use strict";
const entry_1 = require("./entry");
const metadata_1 = require("./metadata");
class ReferenceEntry extends entry_1.Entry {
    constructor(_name, _value, _parent) {
        super(_name, _value, _parent);
    }
    get resolvedEntry() {
        return this.resolvedEntries.pop();
    }
    get resolvedEntries() {
        if (!this._parent) {
            return [];
        }
        let entries = [];
        let scope = this._parent;
        while (true) {
            let entry = scope.get(this._value.dotPath);
            if ((!entry && !scope.parent) || entries.indexOf(entry) !== -1) {
                break;
            }
            if (entry) {
                entries.push(entry);
                if (entry instanceof ReferenceEntry) {
                    entries = entries.concat(entry.resolvedEntries);
                }
                break;
            }
            scope = scope.parent;
        }
        return entries;
    }
    get metadata() {
        if (!this.resolvedEntries.length) {
            return super.metadata;
        }
        let obj = Object.assign({}, this.resolvedEntries.shift().metadata.toObject(), super.metadata.toObject());
        return metadata_1.Metadata.fromObject(obj);
    }
    set metadata(newMetadata) {
        super.metadata = newMetadata;
    }
    toString(level = 0) {
        let result = `${this.name}: ${this._value.toString(level)}`;
        if (super.metadata.isEmpty()) {
            return result;
        }
        result += super.metadata.toString(level + 1);
        return result;
    }
}
exports.ReferenceEntry = ReferenceEntry;
