SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: test

test: lib
	./node_modules/.bin/mocha test --compilers js:babel-core/register

lib: $(LIB)

lib/%.js: src/%.js .babelrc
	mkdir -p $(@D)
	./node_modules/.bin/babel $< -o $@

clean:
	rm lib/*.js
