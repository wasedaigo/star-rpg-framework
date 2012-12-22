#!/usr/bin/env node

var fs   = require('fs');
var http = require('http');
var path = require('path');
var url  = require('url');

/*
 * File handler for a HTTP server
 */
function fileHandler(req, res) {
    var pathname = url.parse(req.url).pathname.substring(1);
    if (pathname === '') {
        pathname = 'index.html'
    }
    const filename = path.join(process.cwd(), 'html', pathname);
    fs.exists(filename, function (result) {
        // The requested file doesn't exist.
        if (!result) {
            console.log('404 Not Found:', filename);
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found');
            res.end();
            return;
        }
        // Return the requested file.
        const ext = path.extname(filename).substring(1);
        contentType = {
            'css':  'text/css',
            'html': 'text/html',
            'jpeg': 'image/jpeg',
            'jpg':  'image/jpeg',
            'js':   'text/javascript',
            'png':  'image/png',
            'txt':  'text/plain',
        }[ext] || 'application/octet-stream';
        res.writeHead(200, {'Content-Type': contentType})
        console.log('200 OK:', filename);
        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    });
}

const port = (parseInt(process.argv[2], 10) || 8000);
var server = http.createServer(fileHandler);
server.listen(port);
