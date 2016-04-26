"use strict";
function rgb2hex(r, g, b) {
    var hex = [];
    var rgb = [r, g, b];
    for (var i = 0; i < 3; i++) {
        var bit = (rgb[i] - 0).toString(16);
        hex.push((bit.length == 1) ? '0' + bit : bit);
    }
    return '#' + hex.join('').toUpperCase();
}
exports.rgb2hex = rgb2hex;
