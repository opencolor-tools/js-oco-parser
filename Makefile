SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: build test

build: lib
	./node_modules/.bin/jison grammar/oco.jison --outfile lib/oco-parser.js

test: build
	./node_modules/.bin/mocha test --compilers js:babel-core/register


lib: $(LIB)
lib/%.js: src/%.js .babelrc
	mkdir -p $(@D)
	./node_modules/.bin/babel $< -o $@
