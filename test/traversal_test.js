/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');

describe('Traversal', () => {
  it('should traverse by type', () => {
    var test = `
group 1:
  color 1: #ff0
  color 2: #fe0
group 2:
  color 3: #fd0
`;
    var tree = oco.parse(test);
    var calls = 0;
    var entries = [];
    tree.traverseTree(['Color'], (entry) => { calls+= 1; entries.push(entry.name); });
    expect(calls).to.equal(3);
    expect(entries.join(",")).to.equal(['color 1', 'color 2', 'color 3'].join(","));
  });

  it('manipulation whily travesring should not break loop', () => {
    var test = `
color 1: #ff0
color 2: #fe0
color 3: #fd0
`;
    var tree = oco.parse(test);
    var calls = 0;
    tree.traverseTree(['Color'], (entry) => {
      calls++;
      tree.set('clone - ' + entry.name, entry.clone());
    });
    expect(calls).to.equal(3);
    expect(tree.children.length).to.equal(6);
  });

  it('should get a deep path', () => {
    var test = `
group 1:
  group 2:
    color: #ff0
`;
    var tree = oco.parse(test);
    expect(tree.get('group 1').get('group 2').get('color').path()).to.equal('group 1.group 2.color');

  });
  it('should allow access via deep dotpath', () => {
    var test = `
group 1:
  group 2:
    color: #ff0
`;
    var tree = oco.parse(test);
    expect(tree.get('group 1.group 2.color').hexcolor()).to.equal('#FFFF00');
  });
});
