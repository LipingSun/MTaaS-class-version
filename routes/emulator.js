var request = require('request');
express = require('express');

var url = 'http://8.21.28.162:8888/emulator';

var emulator = express();

emulator.get('/', function (req, res) {
    request.get(url, function(error, response, body) {
        if (!error) {
            console.log('Response Code: ' + response.statusCode);
            if (response.statusCode == 200) {
                res.setHeader('Content-Type', 'application/json');
                body = body.toString();
            } else {
                body = "Create emulator fail";
            }
            res.end(body);
        } else {
            console.log('Error: ' + error);
        }
    });
});

emulator.get('/:id', function (req, res) {
    request.get(url + '?id=' + req.params.id, function(error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            if (response.statusCode == 200) {
                res.setHeader('Content-Type', 'application/json');
                body = body.toString();
            } else {
                body = "No emulator found";
            }
            res.end(body);
        } else {
            console.log('Error: ' + error);
        }
    });
});

emulator.post('/', function (req, res) {
    request.post(url, {body: req.body, json: true}, function(error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            if (response.statusCode == 200) {
                res.setHeader('Content-Type', 'application/json');
                body = JSON.stringify(body);
            } else {
                body = "No emulator found";
            }
            res.end(body);
        } else {
            console.log('Error: ' + error);
        }
    });
});

emulator.del('/:id', function (req, res) {
    request.del(url, {body: {'id': Number(req.params.id)}, json: true}, function(error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            if (response.statusCode == 200) {
                res.setHeader('Content-Type', 'application/json');
                body = JSON.stringify(body);
            } else {
                body = "No emulator found";
            }
            res.end(body);
        } else {
            console.log('Error: ' + error);
        }
    });
});

module.exports = emulator;