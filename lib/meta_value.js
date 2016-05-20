'use strict';

function metaValue(value) {
  /* This is a trick to get rid of circular dependencies between Reference and MetaProxy */
  var Reference = require('./reference');
  var ColorValue = require('./color_value');
  var newValue = value;
  if (typeof value === 'string') {
    if (value.match(/^=/)) {
      // shortcut for creating references
      var name = value.slice(1).trim();
      newValue = new Reference('metachild', name);
    } else if (value.match(/^#([a-fA-F0-9]){3,8}/) || value.match(/^rgba?\(.*\)$/)) {
      // shortcut for creating colors
      newValue = ColorValue.fromColorValue(value);
    } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
      newValue = true;
    } else if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') {
      newValue = false;
    } else if (value.match(/^[0-9\.,]+$/)) {
      var num = parseFloat(value);
      if (!isNaN(num)) {
        newValue = num;
      }
    }
  }
  return newValue;
}

module.exports = metaValue;
