'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = parse;

var _entry = require('./entry');

var _entry2 = _interopRequireDefault(_entry);

var _color_value = require('./color_value');

var _color_value2 = _interopRequireDefault(_color_value);

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

var _parser_error = require('./parser_error');

var _parser_error2 = _interopRequireDefault(_parser_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @ignore */

function resolveURL(resolver, url, line) {
  if (typeof resolver === 'function') {
    return resolver(url, line);
  } else {
    throw new _parser_error2.default('No configured URL resolver, URL cannot be resolved', { line: line });
  }
}

function parse(input) {
  var urlResolver = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var tokenized = tokenize(input.toString());
  var transformed = transform(tokenized);
  var adjusted = adjustTypes(transformed);
  var metaadjusted = normalizeMetadata(adjusted);
  var objectified = objectify(metaadjusted, urlResolver);
  return objectified;
}

function tokenize(input) {
  var output = [];
  var lines = input.split('\n');
  lines.forEach(function (line) {
    line = line.replace(/(^|\s+)\/\/.*$/, ''); // remove comments
    var tokens = line.split(':');
    if (tokens.length > 2) {
      // we might have a url or something
      tokens = [tokens[0], tokens.splice(1).join(':')];
    }
    output.push({ indent: indent(line), tokens: tokens.map(function (t) {
        return t.trim();
      }) });
  });
  return output;
}

function indent(line) {
  var m = line.match(/^[ \t]+/);
  if (!m) {
    return 0;
  }
  return m[0].length;
}

function makeArrayUnique(inp) {
  // http://stackoverflow.com/questions/1960473/unique-values-in-an-array
  var a = [];
  for (var i = 0, l = inp.length; i < l; i++) {
    if (a.indexOf(inp[i]) === -1) {
      a.push(inp[i]);
    }
  }
  return a;
}

function transform(input) {
  var output = { children: [], type: 'root', name: 'root', parent: null, line: 0 };
  var currentIndent = input[0].indent;
  var currentGroup = output;
  input.forEach(function (line, i) {
    if (line.tokens.length === 1 && line.tokens[0] === '') {
      return;
    } // remove empty lines from the stream)

    if (line.indent > currentIndent) {
      currentGroup = currentGroup.children[currentGroup.children.length - 1];
    } else if (line.indent < currentIndent) {
      currentGroup = currentGroup.parent;
    }
    currentIndent = line.indent;

    if (line.tokens.length === 2 && line.tokens[1] === '') {
      // a Group
      if (line.tokens[0].match(/\//)) {
        // Metadata
        currentGroup.children.push({ type: 'metagroup', name: line.tokens[0], parent: currentGroup, children: [], line: i });
      } else {
        currentGroup.children.push({ type: 'palette', name: line.tokens[0], parent: currentGroup, children: [], line: i });
      }
    } else if (line.tokens.length === 1) {
      // a color or a meta group with trailing slash
      if (line.tokens[0].match(/\/$/)) {
        currentGroup.children.push({ type: 'metagroup', name: line.tokens[0], parent: currentGroup, children: [], line: i });
      } else if (line.tokens[0].match(/\//)) {
        throw new _parser_error2.default('A meta group must either have a trailing slash or must be closed with a colon', { line: i });
      } else if (line.tokens[0].match(/^=/)) {
        currentGroup.children.push({ type: 'reference', value: line.tokens[0], parent: currentGroup, children: [], line: i });
      } else {
        currentGroup.children.push({ type: 'colorvalue', value: line.tokens[0], parent: currentGroup, children: [], line: i });
      }
    } else if (line.tokens.length === 2) {
      // everything else is just a kv
      if (line.tokens[0].match(/\//)) {
        currentGroup.children.push({ type: 'metavalue', name: line.tokens[0], value: line.tokens[1], parent: currentGroup, children: [], line: i });
      } else {
        currentGroup.children.push({ type: 'value', name: line.tokens[0], value: line.tokens[1], parent: currentGroup, children: [], line: i });
      }
    } else {
      // other token lengths are syntax errors
      throw new _parser_error2.default('Too many colons', { line: i });
    }
  });
  return output;
}

function adjustTypes(tree) {
  tree.children.forEach(function (child, i) {
    if (child.type === 'palette') {
      var childTypes = makeArrayUnique(child.children.map(function (c) {
        return c.type;
      }));
      if (childTypes.indexOf('colorvalue') !== -1) {
        if (childTypes.indexOf('palette') !== -1) {
          throw new _parser_error2.default('Color cannot contain both color values and a subpalette', { line: child.line });
        } else if (childTypes.indexOf('value') !== -1) {
          throw new _parser_error2.default('Color cannot contain both color values and named colors', { line: child.line });
        }
        child.type = 'color';
      }
    } else if (child.type === 'value') {
      if (child.parent.type === 'metagroup') {
        child.type = 'metavalue';
        checkForChildren('Metavalue', child);
      } else {
        if (child.value.match(/^=/)) {
          child.type = 'reference';
        } else {
          child.type = 'color';
          child.children.push({ type: 'colorvalue', value: child.value, parent: child, children: [], line: child.line });
          delete child.value;
        }
      }
    } else if (child.type === 'colorvalue') {
      checkForChildren('Colorvalue', child);
    }
    adjustTypes(child);
  });
  return tree;
}

function checkForChildren(type, obj) {
  if (obj.children.length > 0) {
    throw new _parser_error2.default(type + ' ' + obj.name + ' can\'t have children', { line: obj.line });
  }
}

function normalizeMetadata(tree) {
  tree.children.forEach(function (child, i) {
    normalizeMetadata(child);
    if (child.type === 'metavalue') {
      if (tree.type === 'metagroup') {
        if (!tree.parent['metadata']) {
          tree.parent.metadata = [];
        }
        var combinedName = [tree.name, child.name].join('/').replace(/\/\//g, '/');
        addMetadata(tree.parent, child, combinedName);
        tree.children[i] = null;
      } else {
        addMetadata(tree, child);
        tree.children[i] = null;
      }
    } else if (child.type === 'metagroup') {
      if (child['metadata']) {
        var keys = Object.keys(child.metadata);
        keys.forEach(function (key) {
          var combinedName = [child.name, key].join('/').replace(/\/\//g, '/');
          addMetadata(tree, child, combinedName);
        });
      }
      tree.children[i] = null;
    }
  });
  tree.children = tree.children.filter(function (a) {
    return !!a;
  });
  return tree;
}

function addMetadata(obj, metadata) {
  var name = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (!obj['metadata']) {
    obj.metadata = [];
  }
  if (name) {
    metadata.name = name;
  }
  metadata.parent = obj;
  obj.metadata.push(metadata);
}

function objectify(tree) {
  var urlResolver = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var children = tree.children || [];
  children = children.map(function (c) {
    return objectify(c, urlResolver);
  });

  if (tree.type === 'root' || tree.type === 'palette') {
    var _ret = function () {
      var palette = new _entry2.default(tree.name, children, 'Palette', { line: tree.line });
      var metadata = {};
      if (tree.metadata) {
        tree.metadata.forEach(function (md) {
          metadata[md.name] = md.value;
        });
      }
      palette.addMetadata(metadata);
      return {
        v: palette
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else if (tree.type === 'color') {
    var _ret2 = function () {
      var color = new _entry2.default(tree.name, children, 'Color', { line: tree.line });
      color.children = children;
      var metadata = {};
      if (tree.metadata) {
        tree.metadata.forEach(function (md) {
          metadata[md.name] = md.value;
        });
      }
      color.addMetadata(metadata);
      return {
        v: color
      };
    }();

    if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
  } else if (tree.type === 'colorvalue') {
    var cv = _color_value2.default.fromColorValue(tree.value, tree.line);
    return cv;
  } else if (tree.type === 'reference') {
    var _ret3 = function () {
      var ref = null;
      if (tree.value.match(/^=url\(/)) {
        var urlMatch = tree.value.match(/^=url\((.*)?\)/);
        if (urlMatch) {
          var contents = resolveURL(urlResolver, urlMatch[1], tree.line);
          if (typeof contents !== 'undefined') {
            ref = parse(contents, urlResolver);
            ref.name = tree.name;
          } else {
            throw new _parser_error2.default('URL Resolver did not return valid contents', tree.line);
          }
        } else {
          throw new _parser_error2.default('Not a valid URL reference', tree.line);
        }
      } else {
        ref = new _reference2.default(tree.name, tree.value);
      }

      var metadata = {};
      if (tree.metadata) {
        tree.metadata.forEach(function (md) {
          metadata[md.name] = md.value;
        });
      }
      ref.addMetadata(metadata);
      return {
        v: ref
      };
    }();

    if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
  }
}
