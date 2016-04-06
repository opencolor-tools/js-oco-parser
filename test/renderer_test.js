/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');
var fs = require("fs");

describe('Renderer', () => {
  it("should render a simple example", () => {
    var tree = new oco.Entry();
    var value = new oco.ColorValue.fromColorValue('#ffe');
    var color = new oco.Entry('bright yellow', [value], 'Color');
    color.addMetadata({'key/key': 'Value'});
    tree.addChild(color);
    var result = oco.render(tree);
    var expected = `bright yellow:
  #ffe
  key/key: Value
`;
    expect(result).to.equal(expected);
  });

  it("should render a simple Reference", () => {
    var tree = new oco.Entry();
    var ref = new oco.Reference('almost yellow','bright yellow');
    var value = new oco.ColorValue.fromColorValue('#ffe');
    var color = new oco.Entry('bright yellow', [value], 'Color');
    tree.addChild(color);
    tree.addChild(ref);
    var result = oco.render(tree);
    var expected = `bright yellow: #ffe
almost yellow: =bright yellow
`;
    expect(result).to.equal(expected);
  });

  it("should render nested blocks", () => {
    var tree = new oco.Entry();
    var value = new oco.ColorValue.fromColorValue('#ffe');
    var color = new oco.Entry('bright yellow', [value], 'Color');
    var palette = new oco.Entry('yellows');
    palette.addChild(color);
    tree.addChild(palette);
    var result = oco.render(tree);
    var expected = `yellows:
  bright yellow: #ffe
`;
    expect(result).to.equal(expected);

  });

  it("should render complex example", () => {
    var input = fs.readFileSync('test/fixtures/test.oco');
    var tree = oco.parse(input);
    // basically just one assertion to verify the parsing worked.
    var result = oco.render(tree);
    expect(result).to.equal(input.toString());


  });

});
