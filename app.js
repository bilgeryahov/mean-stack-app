/**
 * Created by Bilger on 12-Feb-17.
 */

'use strict';

const express = require('express');
const path    = require('path');

const app     = express();

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/json', function(req, res){

    console.log('GET the json');

    res
        .status(200)
        .json(
            {
                "jsonData": true
            }
        );
});

app.get('/file', function(req, res){

    console.log('GET the file');

    res
        .status(200)
        .sendFile(path.join(__dirname, 'README.md'));
});

const server = app.listen(app.get('port'), function(){

    let port = server.address().port;
    console.log('Server listening on port: ', port);
});