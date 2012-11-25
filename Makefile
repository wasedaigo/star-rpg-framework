# Build JS file from TS files
bake:
	tsc --sourcemap apps/sample/src/Main.ts --out apps/sample/game.js

.PHONY: bake
