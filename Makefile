# Build JS file from TS files
bake:
	tsc --sourcemap apps/sample/src/Main.ts --out apps/sample/game.js

# Declare 'bake' is not a file name in case of existence of a file named 'bake'
.PHONY: bake
