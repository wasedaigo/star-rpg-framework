# Default command
all: bake

# Build JS file from TS files
bake:
	tsc --sourcemap apps/sample/src/Main.ts --out apps/sample/src/game.js --target ES5

# Clean generated files
clean:
	rm apps/sample/src/game.js
	rm apps/sample/src/game.js.map

# Declare 'bake' is a command in case of existence of a file named 'bake'
.PHONY: all bake clean
