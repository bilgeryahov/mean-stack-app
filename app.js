/**
 * Created by Bilger on 12-Feb-17.
 */

'use strict';

require('./api/data/dbconnection.js').open();

const express    = require('express');
const path       = require('path');
const routes     = require('./api/routes');
const bodyParser = require('body-parser');

const app        = express();

app.set('port', 3000);

app.use(function(req, res, next){

    console.log(req.method, req.url);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Runs before API routes run. Extended is false,
// since we do need access to arrays and strings only.
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', routes);

const server = app.listen(app.get('port'), function(){

    let port = server.address().port;
    console.log('Server listening on port: ', port);
});