'use strict';

const express = require('express');
const router = express.Router();

const ctrlHotels = require('../controllers/hotels.controllers.js');
const ctrlReviews = require('../controllers/reviews.controllers');
const ctrlUsers = require('../controllers/users.controllers');

// Hotels routes

router
    .route('/hotels')
    .get(ctrlHotels.hotelsGetAll)
    .post(ctrlHotels.hotelsAddOne);

router
    .route('/hotels/:hotelID')
    .get(ctrlHotels.hotelsGetOne)
    .put(ctrlHotels.hotelsUpdateOne)
    .delete(ctrlHotels.hotelsDeleteOne);

// Reviews routes

router
    .route('/hotels/:hotelID/reviews')
    .get(ctrlReviews.reviewsGetAll)
    .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);

router
    .route('/hotels/:hotelID/reviews/:reviewID')
    .get(ctrlReviews.reviewsGetOne)
    .put(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne);

// Authentication routes

router
    .route('/users/register')
    .post(ctrlUsers.register);

router
    .route('/users/login')
    .post(ctrlUsers.login);

module.exports = router;