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

    if(req.body && req.body.stars){

        req.body.stars = parseInt(req.body.stars, 10);
    }

    let coordinates = [];

    if(req.body && req.body.lng && req.body.lat){
        req.body.lng = parseFloat(req.body.lng);
        req.body.lat = parseFloat(req.body.lat);

        coordinates = [req.body.lng, req.body.lat];
    }
    else if(req.body && ((!req.body.lng && req.body.lat)||(req.body.lng && !req.body.lat))){

        console.log('Error: geo coordinates should be passed together!');

        res
            .status(400)
            .json({message: "Geo coordinates should be passed together."});

        return;
    }

    Hotel
        .create({
            name: req.body.name,
            description: req.body.description,
            stars: req.body.stars,
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            location: {
                address: req.body.address,
                coordinates:coordinates
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

    let responseBeforeExec = {
        status: 200,
        message: {message:"OK"}
    };

    let hotelID = req.params.hotelID;

    if(Object.keys(req.body).length === 0){

        console.log('Error: The PUT request did not receive a body!');
        responseBeforeExec.status = 400;
        responseBeforeExec.message = {message: "The update request needs a body."};
    }

    if(req.body.stars){

        req.body.stars = parseInt(req.body.stars, 10);
    }

    let coordinates = [];

    if(req.body.lng && req.body.lat){
        req.body.lng = parseFloat(req.body.lng);
        req.body.lat = parseFloat(req.body.lat);

        coordinates = [req.body.lng, req.body.lat];
    }
    else if((!req.body.lng && req.body.lat)||(req.body.lng && !req.body.lat)){

        console.log('Error: geo coordinates should be passed together!');
        responseBeforeExec.status = 400;
        responseBeforeExec.message = {message: "Geo coordinates should be passed together."};
    }

    if(responseBeforeExec.status !== 200){

        res
            .status(responseBeforeExec.status)
            .json(responseBeforeExec.message);

        return;
    }

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

            if(req.body.name){

                hotel.name = req.body.name;
            }

            if(req.body.description){

                hotel.description = req.body.description;
            }

            if(req.body.stars){

                hotel.stars = req.body.stars;
            }

            if(req.body.services){

                hotel.services = _splitArray(req.body.services);
            }

            if(req.body.photos){

                hotel.photos = _splitArray(req.body.photos);
            }

            if(req.body.currency){

                hotel.currency = req.body.currency;
            }

            if(req.body.address){

                hotel.location.address = req.body.address;
            }

            if(coordinates !== []){

                hotel.location.coordinates = coordinates;
            }

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