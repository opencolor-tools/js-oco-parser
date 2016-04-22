# CHANGELOG

## 0.0.3

- Parser errors now contain the correct line number
- Comments are now better supported
- Blank lines are now largely ignored

## 0.0.2

- Fixed a few important parts of the grammar, the parser should be much more robust now.
- Parser now gets the correct line number to create correct error messages.
- Parser errors now contain a lot of context in the exception object. (This changes the API slightly)
