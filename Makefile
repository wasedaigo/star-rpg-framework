# Default command
all: build

# Build JS file from TS files
build:
	node script/build.js

# Alias for 'build'
bake: build

# Clean generated files
clean:
	node script/clean.js

# Run HTTP File server
server:
	node script/server.js

# Execute tests
unittest:
	tsc ./src/clock/interval.ts ./src/clock/util.ts --out ./test/ebi_game_interval.js --target ES5

# Declare 'build' is a command in case of existence of a file named 'build'
.PHONY: all bake build clean server unittest
