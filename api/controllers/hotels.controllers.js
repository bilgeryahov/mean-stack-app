/**
 * Created by Bilger on 14-Feb-17.
 */

'use strict';

const mongoose = require('mongoose');
const Hotel = mongoose.model('Hotel');

const runGeoQuery = function(req, res){

    let lng = parseFloat(req.query.lng);
    let lat = parseFloat(req.query.lat);

    if(isNaN(lng) || isNaN(lat)){

        console.log('lng or lat did not come as floating point numbers!');

        res
            .status(400)
            .json({
                message: "Lng and lat should be floating point numbers!"
            });

        return;
    }

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

            if(err){

                console.log('Error querying for hotels with geo coordinates!');

                res
                    .status(500)
                    .json({
                        message: err
                    });

                return;
            }

            console.log('Geo stats ', stats);
            res
                .status(200)
                .json(results);
        });
};

module.exports.hotelsGetAll = function(req, res){

    let offset = 0;
    let count = 5;

    const maxCount = 10;

    if(req.query && req.query.lat && req.query.lng){

        return runGeoQuery(req, res);
    }

    if(req.query && req.query.offset){

        offset = parseInt(req.query.offset, 10);
    }

    if(req.query && req.query.count){

        count = parseInt(req.query.count, 10);
    }

    if(isNaN(offset) || isNaN(count)){

        console.log('Offset or count did not come as numbers!');

        res
            .status(400)
            .json({
                message: "Count and offset should be numbers!"
            });

        return;
    }

    if(count > maxCount){

        console.log('Count exceeded the max allowed limit!');

        res
            .status(400)
            .json({
                message: "Count should be less than " + (maxCount + 1)
            });

        return;
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels){

            if(err){

                console.log('Error querying for hotels!');

                res
                    .status(500)
                    .json({
                        message: err
                    });

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
    console.log(`Get hotel with id ${hotelID}`);

    Hotel
        .findById(hotelID)
        .exec(function(err, hotel){

            let response = {
                status: 200,
                message: hotel
            };

            if(err){

                console.log('Error querying for hotels!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Hotel with id ' + hotelID + ' not found!');
                response.status = 404;
                response.message = {
                        message: 'Hotel with this ID has not been found!'
                };
            }

            res
                .status(response.status)
                .json(response.message);
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