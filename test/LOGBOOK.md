# Dev logbook for parser

## (22.03.2016 jk)

- I've reworked the internal structure to rely exclusively on arrays for storing the children of palettes. (Metadata have their own structure). Keys are cached in a Hash/Object for quick access.
- the `get()` method allows for access via indexes AND keys for quick lookup
- There's a forEach that's simply aliased to the children prop.
- I'm thinking about making children a private property, but that's for later.
