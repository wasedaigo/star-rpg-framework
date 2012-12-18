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
 * Glob a directory or a file path with the extension.
 * This will be executed synchronously.
 */
function globWithExtSync(pathStr, ext) {
    var stat = fs.lstatSync(pathStr);
    if (stat.isFile()) {
        if (path.extname(pathStr) === '.' + ext) {
            return [pathStr];
        }
    } else if (stat.isDirectory()) {
        return fs.readdirSync(pathStr).reduce(function (res, file) {
            var newPathStr = path.join(pathStr, file);
            return res.concat(globWithExtSync(newPathStr, ext));
        }, []);
    }
    return [];
}

var inputDir = process.argv[2];
if (inputDir === void(0)) {
    showUsage();
    process.abort();
}

var list = [
    {ext: 'png', type: 'image'},
    {ext: 'tmx', type: 'tmx'},
    {ext: 'wav', type: 'effect'},
];

var result = list.reduce(function (res, desc) {
    var paths = globWithExtSync(inputDir, desc['ext']);
    var newRes = paths.map(function (pathStr) {
        var src = path.join('res', path.relative(inputDir, pathStr));
        if (path.sep !== '/') {
            var reg = new RegExp(escapeRegExp(path.sep), 'g');
            src = src.replace(reg, '/');
        }
        return {
            type: desc['type'],
            src:  src,
        }
    });
    return res.concat(newRes);
}, []);

console.log('var g_resources = ' + JSON.stringify(result) + ';');
