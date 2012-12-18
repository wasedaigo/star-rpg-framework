#!/usr/bin/env node

var fs = require('fs');

var paths = ['./html/resource.js', './html/game.js', './html/game.js.map'];
paths.forEach(function (path) {
    console.log("Removing ", path);
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
});
