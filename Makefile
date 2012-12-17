# Default command
all: bake

# Build JS file from TS files
bake:
	ruby tool/html_resource_packer.rb ./html/res > ./html/resources.js
	tsc --sourcemap ./src/ebi/rpg/Main.ts --out ./html/game.js --target ES5

# Clean generated files
clean:
	rm ./html/resources.js
	rm ./html/game.js
	rm ./html/game.js.map

# Execute tests
unittest:
	tsc ./src/clock/interval.ts ./src/clock/util.ts --out ./test/ebi_game_interval.js --target ES5

# Declare 'bake' is a command in case of existence of a file named 'bake'
.PHONY: all bake clean
