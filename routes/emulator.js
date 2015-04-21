var http = require('http');
var request = require('request');
express = require('express');

var url = 'http://8.21.28.162:8888/emulator';

var emulator = express();

emulator.get('/', function (req, res) {
    request.get(url, function(error, response, body) {
        if (!error) {
            console.log('Response Code: ' + response.statusCode);
            res.setHeader('Content-Type', 'application/json');
            res.end(body.toString());
        } else {
            console.log('Error: ' + error);
        }
    });
});

emulator.get('/:id', function (req, res) {
    request.get(url + '?id=' + req.params.id, function(error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            res.setHeader('Content-Type', 'application/json');
            res.end(body.toString());
        } else {
            console.log('Error: ' + error);
        }
    });
});

emulator.post('/', function (req, res) {
    request.post(url, JSON.stringify({'id': 3333}), function(error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            console.log('Response: ' + body.toString());
            res.setHeader('Content-Type', 'application/json');
            res.end(body.toString());
        } else {
            console.log('Error: ' + error);
        }
    });

 /*   var opts = {
        host: '8.21.28.162',
        port: 8888,
        method: 'POST',
        path: '/emulator',
        headers: {}
    };
    opts.headers['Content-Type'] = 'application/json';
    req.data = JSON.stringify(req.body);
    opts.headers['Content-Length'] = req.data.length;
    var req = http.request(opts, function(response) {
        response.on('data', function(chunk) {
            res_data += chunk;
        });
        response.on('end', function() {
            callback(res_data);
        });
    });
    req.on('error', function(e) {
        console.log("Got error: " + e.message);
    });
// write the data
    if (opts.method != 'GET') {
        req.write(req.data);
    }
    req.end();*/
});

emulator.del('/:id', function (req, res) {
    request.del(url, {'id' : req.params.id}, function(error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            res.setHeader('Content-Type', 'application/json');
            res.end(body.toString());
        } else {
            console.log('Error: ' + error);
        }
    });
});

module.exports = emulator;