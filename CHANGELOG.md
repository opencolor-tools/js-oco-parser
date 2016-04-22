# CHANGELOG

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
