"use strict";
class ReferenceValue {
    constructor(_dotPath) {
        this._dotPath = _dotPath;
    }
    get dotPath() {
        return this._dotPath;
    }
    toString(level) {
        return `=${this._dotPath}`;
    }
}
exports.ReferenceValue = ReferenceValue;
