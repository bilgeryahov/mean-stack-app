/**
 * Created by Bilger on 14-Feb-17.
 */

'use strict';

const hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(req, res){

    let returnData = {};
    let logMessage = '';

    if(req.query && req.query.offset && req.query.count){

        let offset = parseInt(req.query.offset, 10);
        let count = parseInt(req.query.count, 10);

        returnData = hotelData.slice(offset, offset + count);
        logMessage = 'GET ' + count + ' hotels starting from ' + offset;
    }

    if(Object.keys(returnData).length === 0){

        returnData = hotelData;
        logMessage = 'GET all the hotels'
    }

    console.log(logMessage);

    res
        .status(200)
        .json(returnData);
};

module.exports.hotelsGetOne = function(req, res){

    let hotelID = req.params.hotelID;
    let thisHotel = hotelData[hotelID];

    console.log('GET all the hotel ' + hotelID);

    res
        .status(200)
        .json(thisHotel);
};