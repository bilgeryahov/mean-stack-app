/**
 * Created by Bilger on 14-Feb-17.
 */

'use strict';

const mongoose = require('mongoose');
const Hotel = mongoose.model('Hotel');

const runGeoQuery = function(req, res){

    let lng = parseFloat(req.query.lng);
    let lat = parseFloat(req.query.lat);

    // A geoJSON point.
    let point = {
        type: "Point",
        coordinates: [lng, lat]
    };

    let geoOptions = {
        spherical: true,
        maxDistance: 2000,
        num: 5
    };

    Hotel
        .geoNear(point, geoOptions, function(err, results, stats){

            console.log('Geo stats ', stats);
            res
                .status(200)
                .json(results);
        });
};

module.exports.hotelsGetAll = function(req, res){

    let offset = 0;
    let count = 5;

    if(req.query && req.query.lat && req.query.lng){

        return runGeoQuery(req, res);
    }

    if(req.query && req.query.offset){

        offset = parseInt(req.query.offset, 10);
    }

    if(req.query && req.query.count){

        count = parseInt(req.query.count, 10);
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels){

            if(err){

                console.log(err);
                return;
            }

            console.log('Found hotels ', hotels.length);
            res
                .status(200)
                .json(hotels);
         });
};

module.exports.hotelsGetOne = function(req, res){

    let hotelID = req.params.hotelID;

    Hotel
        .findById(hotelID)
        .exec(function(err, hotel){

            if(err){

                console.log(err);
                return;
            }

            console.log('Found hotel with id ', hotelID);

            res
                .status(200)
                .json(hotel);
        });
};

module.exports.hotelsAddOne = function(req, res){

    let db = dbconnection.get();
    let collection = db.collection('hotels');
    let newHotel;

    if(req.body && req.body.name && req.body.stars){

        newHotel  = req.body;
        newHotel.stars = parseInt(req.body.stars, 10);

        collection.insertOne(newHotel, function(err, data){

            if(err){

                console.log(err);
                return;
            }

            console.log('POST new hotel');
            res
                .status(201)
                .json(data.ops);
        });
    }
    else{

        console.log('Body missing.');
        res
            .status(400)
            .json({message: 'Missing body.'});
    }
};