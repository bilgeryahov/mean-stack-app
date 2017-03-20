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
        .exec(function(err, reviews){

            if(err){

                console.log(err);
                return;
            }

            res
                .status(200)
                .json(reviews);
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
        .exec(function(err, reviews){

            if(err){

                console.log(err);
                return;
            }

            let review = reviews.reviews.id(reviewID);

            res
                .status(200)
                .json(review);
        });
};