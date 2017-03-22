'use strict';

const mongoose = require('mongoose');
const Hotel = mongoose.model('Hotel');

const runGeoQuery = function(req, res){

    let lng = parseFloat(req.query.lng);
    let lat = parseFloat(req.query.lat);

    if(isNaN(lng) || isNaN(lat)){

        console.log('Error: lng or lat did not come as floating point numbers!');

        res
            .status(400)
            .json({
                message: "Lng and lat should be floating point numbers."
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

                console.log('Error: querying for hotels with geo coordinates went wrong!');

                res
                    .status(500)
                    .json({
                        message: err
                    });

                return;
            }

            console.log('Info: Geo stats ', stats);
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

        console.log('Error: offset or count did not come as numbers!');

        res
            .status(400)
            .json({
                message: "Count and offset should be numbers."
            });

        return;
    }

    if(count > maxCount){

        console.log('Error: count exceeded the max allowed limit!');

        res
            .status(400)
            .json({
                message: "Count should be less than " + (maxCount + 1) + '.'
            });

        return;
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels){

            if(err){

                console.log('Error: querying for hotels went wrong!');

                res
                    .status(500)
                    .json({
                        message: err
                    });

                return;
            }

            console.log('Info: found hotels ', hotels.length);
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

            let response = {
                status: 200,
                message: hotel
            };

            if(err){

                console.log('Error: querying for a hotel went wrong!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Info: hotel with id ' + hotelID + ' not found!');
                response.status = 404;
                response.message = {
                        message: 'Hotel with this ID has not been found.'
                };
            }

            res
                .status(response.status)
                .json(response.message);
        });
};

const _splitArray = function(input){

    let output = [];

    if(input && input.length > 0){

        output = input.split(';');
    }

    return output;
};

module.exports.hotelsAddOne = function(req, res){

    Hotel
        .create({
            name: req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars, 10),
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            location: {
                address: req.body.address,
                coordinates:[
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
            }
        }, function(err, hotel){

            if(err){

                console.log('Error: creating a new hotel went wrong!');

                res
                    .status(400)
                    .json(err);

                return;
            }

            console.log('Info: Hotel created!');

            res
                .status(201)
                .json(hotel);
        });
};

module.exports.hotelsUpdateOne = function(req, res){

    let hotelID = req.params.hotelID;

    Hotel
        .findById(hotelID)
        .select("-reviews -rooms")
        .exec(function(err, hotel){

            let response = {
                status: 200,
                message: hotel
            };

            if(err){

                console.log('Error: querying a for hotel went wrong!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Error: hotel with id ' + hotelID + ' not found!');
                response.status = 404;
                response.message = {
                    message: 'Hotel with this ID has not been found.'
                };
            }

            if(response.status !== 200){

                res
                    .status(response.status)
                    .json(response.message);

                return;
            }

            hotel.name = req.body.name;
            hotel.description = req.body.description;
            hotel.stars = parseInt(req.body.stars, 10);
            hotel.services = _splitArray(req.body.services);
            hotel.photos = _splitArray(req.body.photos);
            hotel.currency = req.body.currency;
            hotel.location = {
                address: req.body.address,
                coordinates:[
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
            };

            hotel.save(function(err, hotelUpdated){

                if(err){

                    console.log("Error: trying to modify a hotel went wrong!");
                    res
                        .status(500)
                        .json(err);

                    return;
                }

                res
                    .status(204)
                    .json();
            });
        });
};

module.exports.hotelsDeleteOne = function(req, res){

    const hotelID = req.params.hotelID;

    Hotel
        .findByIdAndRemove(hotelID)
        .exec(function(err, hotel){

            let response = {
                status: 204,
                message: {}
            };

            if(err){

                console.log('Error: deleting hotel ' + hotelID + ' went wrong!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Error: hotel with ID ' + hotelID + ' not found!');
                response.status = 404;
                response.message= {
                    message: 'Hotel with ID ' + hotelID + ' has not been not found.'
                };
            }

            if(response.status === 204){

                console.log('Info: deleted hotel with ID ' + hotelID);
            }

            res
                .status(response.status)
                .json(response.message);
        });
};