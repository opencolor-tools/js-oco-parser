/* jshint -W097 */
'use strict';
var expect = require('chai').expect;
var oco = require('../lib/index.js');

describe('Manually creating OCO objects', () => {
  it("should create a root palette", () => {
    var root = new oco.Entry();
    expect(root.type).to.equal('Root');
    expect(root.name).to.equal('Root');
  });


});
