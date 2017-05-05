'use strict';

let mongoose = require('mongoose');
let dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);

mongoose.connection.on('connected', function(){

    console.log('Info: Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected', function(){

    console.log('Info: Mongoose disconnected from ' + dburl);
});

mongoose.connection.on('error', function(err){

    console.log('Info: Mongoose connection error ' + err);
});

process.on('SIGINT', function(){

    mongoose.connection.close(function(){

        console.log('Info: Mongoose disconnected through app termination SIGINT');
        process.exit(0);
    })
});

process.on('SIGTERM', function(){

    mongoose.connection.close(function(){

        console.log('Info: Mongoose disconnected through app termination SIGTERM');
        process.exit(0);
    })
});

process.once('SIGUSR2', function(){

    mongoose.connection.close(function(){

        console.log('Info: Mongoose disconnected through app termination SIGUSR2');
        process.kill(process.pid, 'SIGUSR2');
    })
});

require('./hotels.model');
require('./users.model');