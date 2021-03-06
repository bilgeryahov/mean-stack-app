'use strict';

const mongoose = require('mongoose');
const Hotel = mongoose.model('Hotel');

// Get all reviews for a hotel.
module.exports.reviewsGetAll = function(req, res){

    let hotelID = req.params.hotelID;

    Hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, hotel){

            let response = {
                status: 200,
                message: {}
            };

            if(err){

                console.log('Error: finding the hotel with id ', hotelID + ' did not succeed!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Error: hotel with ID ' + hotelID + ' not found in the database!');
                response.status = 404;
                response.message = {
                    message: 'Hotel with ID ' + hotelID + ' has not been found.'
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

    Hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, hotel){

            let response = {
                status: 200,
                message: {}
            };

            if(err){

                console.log('Error: finding the hotel with id ', hotelID + ' did not succeed!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Error: hotel with ID ' + hotelID + ' not found in the database!');
                response.status = 404;
                response.message = {
                    message: 'Hotel with ID ' + hotelID + ' has not been found.'
                };
            }
            else{

                response.message = hotel.reviews.id(reviewID);

                if(!response.message){

                    response.status = 404;
                    response.message = {
                        message: 'Review with ID ' + reviewID + ' has not been found.'
                    };
                }
            }

            res
                .status(response.status)
                .json(response.message);
        });
};

const _addReview = function(req, res, hotel){

    // The model instance.
    hotel.reviews.push({
        name: req.body.name,
        rating: parseInt(req.body.rating, 10),
        review: req.body.review
    });

    // The model instance.
    hotel.save(function(err, hotelUpdated){

        if(err){

            res
                .status(500)
                .json(err);

            return;
        }

        res
            .status(201)
            .json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
    });
};

module.exports.reviewsAddOne = function(req, res){

    let hotelID = req.params.hotelID;

    Hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, hotel){

            let response = {
                status: 200,
                message: {}
            };

            if(err){

                console.log('Error: finding the hotel with id ', hotelID + ' did not succeed!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Error: hotel with ID ' + hotelID + ' not found in the database!');
                response.status = 404;
                response.message = {
                    message: 'Hotel with ID ' + hotelID + ' has not been found.'
                };
            }
            else{

                return _addReview(req, res, hotel);
            }

            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.reviewsUpdateOne = function(req, res){

    let hotelID = req.params.hotelID;
    let reviewID = req.params.reviewID;

    Hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, hotel){

            let thisReview;

            let response = {
                status: 200,
                message: {}
            };

            if(err){

                console.log('Error: finding the hotel with id ', hotelID + ' did not succeed!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Hotel with ID ' + hotelID + ' not found in the database!');
                response.status = 404;
                response.message = {
                    message: 'Hotel with ID ' + hotelID + ' has not been found.'
                };
            }
            else{

                // Get the review.
                thisReview = hotel.reviews.id(reviewID);

                if(!thisReview){

                    response.status = 404;
                    response.message = {
                        message: 'Review with ID ' + reviewID + ' has not been found.'
                    };
                }
            }

            if(response.status !== 200){

                res
                    .status(response.status)
                    .json(response.message);

                return;
            }

            thisReview.name = req.body.name;
            thisReview.rating = req.body.rating;
            thisReview.review = req.body.review;

            hotel.save(function(err, hotelUpdated){

                if(err){

                    console.log('Error: problem updating review ' + reviewID + ' from hotel ' + hotelID + '!');

                    res
                        .status(500)
                        .json(err);

                    return;
                }

                console.log(`Info: Review ${reviewID}, from hotel ${hotelID} updated!`);

                res
                    .status(204)
                    .json();
            });
        });
};

module.exports.reviewsDeleteOne = function(req, res){

    let hotelID = req.params.hotelID;
    let reviewID = req.params.reviewID;

    Hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, hotel){

            let thisReview;

            let response = {
                status: 200,
                message: {}
            };

            if(err){

                console.log('Error: finding the hotel with id ', hotelID + ' did not succeed!');
                response.status = 500;
                response.message = err;
            }
            else if(!hotel){

                console.log('Hotel with ID ' + hotelID + ' not found in the database!');
                response.status = 404;
                response.message = {
                    message: 'Hotel with ID ' + hotelID + ' has not been found.'
                };
            }
            else{

                // Get the review.
                thisReview = hotel.reviews.id(reviewID);

                if(!thisReview){

                    response.status = 404;
                    response.message = {
                        message: 'Review with ID ' + reviewID + ' has not been found.'
                    };
                }
            }

            if(response.status !== 200){

                res
                    .status(response.status)
                    .json(response.message);

                return;
            }

            hotel.reviews.id(reviewID).remove(); // Once that's done we continue with the saving...

            hotel.save(function(err, hotelUpdated){

                if(err){

                    console.log('Error: problem deleting review ' + reviewID + ' from hotel ' + hotelID + '!');

                    res
                        .status(500)
                        .json(err);

                    return;
                }

                console.log(`Info: Review ${reviewID}, from hotel ${hotelID} deleted!`);

                res
                    .status(204)
                    .json();
            });
        });
};