/* jshint -W097 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
  function Renderer(root) {
    _classCallCheck(this, Renderer);

    this.root = root;
  }

  _createClass(Renderer, [{
    key: 'renderPalette',
    value: function renderPalette(entry, indent) {
      var string = '';
      var childrenIndent = indent;
      if (!entry.isRoot()) {
        string = this.renderIndent(indent) + entry.name + ':\n';
        childrenIndent += 1;
      }
      string += this.renderMetadataEntries(entry, childrenIndent);
      string += this.renderChildren(entry, childrenIndent);
      return string;
    }
  }, {
    key: 'renderColor',
    value: function renderColor(entry, indent) {
      var metalength = entry.metadata.keys(true).length;
      var childLength = entry.children.length;
      var realIndent = 0;
      var separator = ' ';
      if (metalength > 0 || childLength > 1) {
        separator = '\n';
        realIndent = indent + 1;
      }
      var string = this.renderIndent(indent) + entry.name + ':' + separator;
      string += this.renderChildren(entry, realIndent);
      string += this.renderMetadataEntries(entry, realIndent);
      return string;
    }
  }, {
    key: 'renderColorValue',
    value: function renderColorValue(entry, indent) {
      var string = this.renderIndent(indent) + entry.value + '\n';
      return string;
    }
  }, {
    key: 'renderReference',
    value: function renderReference(entry, indent) {
      var string = this.renderIndent(indent) + entry.name + ': =' + entry.refName + '\n';
      string += this.renderMetadataEntries(entry, indent + 1);
      return string;
    }
  }, {
    key: 'renderIndent',
    value: function renderIndent(indent) {
      var out = '';
      var i;
      for (i = 0; i < indent; i++) {
        out += '  ';
      }
      return out;
    }
  }, {
    key: 'findMetaGroups',
    value: function findMetaGroups(keys) {
      var groupCounts = {};
      var groups = [];
      keys.forEach(function (key) {
        var segments = key.split('/');
        if (segments[0] !== '') {
          groupCounts[segments[0]] = (groupCounts[segments[0]] || 0) + 1;
        }
        if (groupCounts[segments[0]] && groupCounts[segments[0]] > 1) {
          groups.push(segments[0]);
        }
      });
      return groups;
    }
  }, {
    key: 'groupMetadata',
    value: function groupMetadata(entry) {
      var keys = entry.metadata.keys();
      var grouped = {};
      var groups = this.findMetaGroups(keys);
      keys.forEach(function (key) {
        var segments = key.split('/');
        var first = segments.shift();
        if (groups.indexOf(first) !== -1) {
          grouped[first] = grouped[first] || {};
          grouped[first][segments.join('/')] = entry.metadata.get(key);
        } else {
          grouped[key] = entry.metadata.get(key);
        }
      });
      return grouped;
    }
  }, {
    key: 'renderMetaGroups',
    value: function renderMetaGroups(groups, indent) {
      var _this = this;

      var out = '';
      if (!groups) {
        return out;
      }
      Object.keys(groups).forEach(function (key) {
        var value = groups[key];
        if (typeof value === 'string' || typeof value === 'number') {
          out += _this.renderIndent(indent) + key + ': ' + value + '\n';
        } else if (typeof value === 'boolean') {
          out += _this.renderIndent(indent) + key + ': ' + (value ? 'true' : 'false') + '\n';
        } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && 'type' in value) {
          if (value.type === 'ColorValue') {
            out += _this.renderIndent(indent) + key + ': ' + value.value + '\n';
          } else if (value.type === 'Reference') {
            out += _this.renderIndent(indent) + key + ': =' + value.refName + '\n';
          }
        } else {
          out += _this.renderIndent(indent) + key + '/\n' + _this.renderMetaGroups(value, indent + 1);
        }
      });
      return out;
    }
  }, {
    key: 'renderMetadataEntries',
    value: function renderMetadataEntries(entry, indent) {
      if (entry.metadata.keys().length === 0) {
        return '';
      }
      var grouped = this.groupMetadata(entry);
      return this.renderMetaGroups(grouped, indent);
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(entry, indent) {
      var _this2 = this;

      var out = '';
      entry.children.forEach(function (child) {
        out += _this2.getRenderMethod(child.type)(child, indent);
      });
      return out;
    }
  }, {
    key: 'getRenderMethod',
    value: function getRenderMethod(type) {
      if (this['render' + type]) {
        return this['render' + type].bind(this);
      } else {
        throw new Error('No Render Method for type ' + type + 'found.');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.renderPalette(this.root, 0);
    }
  }]);

  return Renderer;
}();

module.exports = Renderer;
