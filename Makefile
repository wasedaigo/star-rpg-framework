# Default command
all: bake

# Build JS file from TS files
bake:
	tsc --sourcemap apps/sample/src/Main.ts --out apps/sample/game.js --target ES5

# Clean generated files
clean:
	rm apps/sample/game.js
	rm apps/sample/game.js.map

# Declare 'bake' is a command in case of existence of a file named 'bake'
.PHONY: all bake clean
