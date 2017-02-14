/**
 * Created by Bilger on 14-Feb-17.
 */

'use strict';

const hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(req, res){

    console.log('GET all the hotels');

    res
        .status(200)
        .json(hotelData);
};