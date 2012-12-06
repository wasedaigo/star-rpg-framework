# Default command
all: bake

# Build JS file from TS files
bake:
	ruby tool/html_resource_packer.rb ./res > ./resources.js
	tsc --sourcemap ebi/rpg/Main.ts --out ./game.js --target ES5

# Clean generated files
clean:
	rm ./resources.js
	rm ./game.js
	rm ./game.js.map

# Declare 'bake' is a command in case of existence of a file named 'bake'
.PHONY: all bake clean
