
all: build test

build:
	./node_modules/.bin/jison grammar/oco.jison --outfile lib/oco-parser.js

test: build
	./node_modules/.bin/mocha test
