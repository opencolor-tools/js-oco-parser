# CHANGELOG

## 0.1.0

- New, naive parser, much faster, hopefully easier to fix and to give meaningful error messages.
- New way of handling metadata.
- module exports now use ES6 syntax
- Tests run on src, to allow for easier test runs, singeling out tests etc.
- switched to standardjs for linting and changed syntax throughout the project accordingly

This is more or less a release candidate for a 1.0 release.

## 0.0.8

- `ColorValues` are now parsed with tinycolor2. Hexcolors are thus named "hex" instead of "rgb". If tinycolor2 successfully parses a color value, the `ColorValue` is marked as "identified" and `.value` is the tinycolor object, which means that
`.value.toString(format)` gives you various options to convert the color to different formats.
- Added `hexcolor()` function to both Color Value and Color, if an identified color is found, it's converted to a hexcolor.
- added `traverseTree()` method to traverse the tree and filter by type as well.
- added `set()` to `Entry`, including the possibility of setting with a dotPath.
- enhanced `get()` on `Entry` to allow getting via dotPath.
- `dotPath()` on `Entry` returns the fully qualified dotpath for the node.

## 0.0.7

- Allowing commas in color names
- Fixing multiple color values on one line

## 0.0.6

- More Meaningful Error objects on parser errors

## 0.0.5

- Fixing comments in metadata blocks

## 0.0.4

- Fixing some comment related parser issues
- Allowing Palettes named "Root"
- Allowing (some form) of parentheses in color/palette names

## 0.0.3

- Parser errors now contain the correct line number
- Comments are now better supported
- Blank lines are now largely ignored

## 0.0.2

- Fixed a few important parts of the grammar, the parser should be much more robust now.
- Parser now gets the correct line number to create correct error messages.
- Parser errors now contain a lot of context in the exception object. (This changes the API slightly)
