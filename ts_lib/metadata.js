"use strict";
class Metadata {
    constructor(_data) {
        this._data = _data;
        if (!_data) {
            this._data = new Map();
        }
    }
    isEmpty() {
        return (this._data.size === 0);
    }
    get(key) {
        return this._data.get(key);
    }
    set(key, value) {
        this._data.set(key, value);
    }
    has(key) {
        return this._data.has(key);
    }
    toObject() {
        let obj = {};
        this._data.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
    toString(level) {
        let lines = [''];
        this._data.forEach((v, k) => lines.push(`${k}: ${v}`));
        return lines.join('\n' + '  '.repeat(level));
    }
    static fromObject(obj) {
        var data = new Map();
        Object.keys(obj).forEach(function (key) {
            if (typeof key == 'string') {
                data.set(key, obj[key]);
            }
        });
        return new Metadata(data);
    }
}
exports.Metadata = Metadata;
