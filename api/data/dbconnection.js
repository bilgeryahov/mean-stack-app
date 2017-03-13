/**
 * Created by Bilger on 11-March-17.
 */

'use strict';

let MongoClient = require('mongodb').MongoClient;
let dburl = 'mongodb://localhost:27017/meanhotel';

let _connection = null;

let open = function(){

    // set the connection
    MongoClient.connect(dburl, function(err, db){

        if(err){

            console.log('DB connection has failed.');
            return;
        }

        _connection = db;
        console.log('DB connection open. ');
    });
};

let get = function(){

    return _connection;
};

module.exports = {
    open: open,
    get: get
};