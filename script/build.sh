#!/bin/sh

echo 'node tool/html_resource_packer.js ./html/res > ./html/resources.js'
node tool/html_resource_packer.js ./html/res > ./html/resources.js

echo 'tsc --sourcemap ./src/ebi/rpg/Main.ts --out ./html/game.js --target ES5'
tsc --sourcemap ./src/ebi/rpg/Main.ts --out ./html/game.js --target ES5
