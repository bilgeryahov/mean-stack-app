'use strict';

const mongoose = require('mongoose');
const Hotel = mongoose.model('Hotel');

// Get all reviews for a hotel.
module.exports.reviewsGetAll = function(req, res){

    let hotelID = req.params.hotelID;
    console.log('Get all reviews for hotel with id ', hotelID);

    Hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, hotel){

            let response = {
                status: 200,
                message: []
            };

            if(err){

                console.log('Error finding the hotel with id ', hotelID);
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Hotel with ID ' + hotelID + ' not found in the database!');
                response.status = 404;
                response.message = {
                    message: 'Hotel with ID ' + hotelID + ' not found!'
                };
            }
            else{

                response.message = hotel.reviews ? hotel.reviews : [];
            }

            res
                .status(response.status)
                .json(response.message);

        });
};

// GET a single review for a hotel.
module.exports.reviewsGetOne = function(req, res){

    let hotelID = req.params.hotelID;
    let reviewID = req.params.reviewID;

    console.log(`Get review with id ${reviewID}  for hotel with id ${hotelID}`);

    Hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, hotel){

            let response = {
                status: 200,
                message: []
            };

            if(err){

                console.log('Error finding the hotel with id ', hotelID);
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Hotel with ID ' + hotelID + ' not found in the database!');
                response.status = 404;
                response.message = {
                    message: 'Hotel with ID ' + hotelID + ' not found!'
                };
            }
            else{

                response.message = hotel.reviews.id(reviewID);

                if(!response.message){

                    response.status = 404;
                    response.message = {
                        message: 'Review with ID ' + reviewID + ' not found!'
                    };
                }
            }

            res
                .status(response.status)
                .json(response.message);
        });
};