export function rgb2hex(r: number, g: number, b: number): string {
  var hex = [];
  var rgb = [r, g, b];
  for (var i = 0; i < 3; i++) {
    var bit = (rgb[i] - 0).toString(16);
    hex.push((bit.length == 1) ? '0' + bit : bit);
  }
  return '#' + hex.join('').toUpperCase();
}
