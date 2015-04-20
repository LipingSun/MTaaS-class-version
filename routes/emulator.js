var request = require('request');
express = require('express');

//var emulatorIP = '8.21.28.197';

var emulator = express();

emulator.get('/', function (req, res) {
    var emulatorIP = '8.21.28.197';
    request.get(emulatorIP + ':8888/emulator', function(emulatorRes) {
        console.log("Got response: " + emulatorRes);
        res.end(emulatorRes);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

emulator.get('/:id', function (req, res) {
    var emulatorIP = '8.21.28.197';
    request.get(emulatorIP + ':8888/emulator?id=' + req.params.id, function(emulatorRes) {
        console.log("Got response: " + emulatorRes);
        res.end(emulatorRes);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

emulator.post('/', function (req, res) {
    var emulatorIP = '8.21.28.197';
    request.post(emulatorIP + ':8888/emulator', req.body, function(emulatorRes) {
        console.log("Got response: " + emulatorRes);
        res.end(emulatorRes);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

emulator.delete('/:id', function (req, res) {
    var emulatorIP = '8.21.28.197';
    request.get(emulatorIP + ':8888/emulator?id=' + req.params.id, function(emulatorRes) {
        console.log("Got response: " + emulatorRes);
        res.end(emulatorRes);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

module.exports = emulator;