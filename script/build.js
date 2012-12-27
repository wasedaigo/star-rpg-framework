#!/usr/bin/env node

var exec = require('child_process').exec;

/*
 * Execute commands synchronously.
 */
function execCommands(commands) {
    if (commands.length === 0) {
        return;
    }
    var command = commands[0];
    console.log(command);
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.error(error.toString());
            return;
        }
        execCommands(commands.slice(1));
    });
}

var commands = [
    'node tool/html_resource_packer.js ./html/res > ./html/resources.js',
    'tsc --sourcemap ./src/ebi/rpg/Main.ts --out ./html/game.js --target ES5',
];
execCommands(commands);
