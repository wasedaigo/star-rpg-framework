#!/usr/bin/env node

var exec = require('child_process').exec;

function createCallback(next) {
    return function (error, stdout, stderr) {
        if (error) {
            console.error(error.toString());
            return;
        }
        if (next === void(0)) {
            return;
        }
        next();
    };
}

console.log('Generating ./html/resources.js');
exec('node tool/html_resource_packer.js ./html/res > ./html/resources.js', createCallback(function () {
    console.log('Compiling ./src/ebi/rpg/Main.ts to ./html/game.js');
    exec('tsc --sourcemap ./src/ebi/rpg/Main.ts --out ./html/game.js --target ES5', createCallback());
}));
