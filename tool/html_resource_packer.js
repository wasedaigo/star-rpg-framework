#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

/*
 * Show the usage.
 */
function showUsage() {
    var file = path.relative(process.cwd(), process.argv[1]);
    console.log('Usage: node ' + file  + ' DIRECTORY');
}

/*
 * Escape special chars of Reguler Expression.
 */
function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

/*
 * Glob a directory or a file path.
 * This will be executed synchronously.
 */
function globSync(pathStr) {
    var stat = fs.lstatSync(pathStr);
    if (stat.isFile()) {
        return [pathStr];
    } else if (stat.isDirectory()) {
        return fs.readdirSync(pathStr).reduce(function (res, file) {
            var newPathStr = path.join(pathStr, file);
            return res.concat(globSync(newPathStr));
        }, []);
    }
    return [];
}

var inputDir = process.argv[2];
if (inputDir === void(0)) {
    showUsage();
    process.abort();
}

var types = {
    png: 'image',
    tmx: 'tmx',
    tsx: 'tmx',
    wav: 'effect',
};

var paths = globSync(inputDir);
var result = paths.filter(function (pathStr) {
    return Object.keys(types).some(function (ext) {
        return path.extname(pathStr) === '.' + ext;
    });
}).map(function (pathStr) {
    var ext = path.extname(pathStr).substr(1);
    var type = types[ext];
    var src = path.join('res', path.relative(inputDir, pathStr));
    if (path.sep !== '/') {
        var reg = new RegExp(escapeRegExp(path.sep), 'g');
        src = src.replace(reg, '/');
    }
    return {
        type: type,
        src:  src,
    }
});

//console.log('var g_resources = ' + JSON.stringify(result) + ';');
console.log('var g_resources = [];');
