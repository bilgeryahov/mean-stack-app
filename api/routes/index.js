/**
 * Created by Bilger on 14-Feb-17.
 */

'use strict';

const express = require('express');
const router = express.Router();

const ctrlHotels = require('../controllers/hotels.controllers.js');
const ctrlReviews = require('../controllers/reviews.controllers');

router
    .route('/hotels')
    .get(ctrlHotels.hotelsGetAll)
    .post(ctrlHotels.hotelsAddOne);

router
    .route('/hotels/:hotelID')
    .get(ctrlHotels.hotelsGetOne);

// Reviews routes

router
    .route('/hotels/:hotelID/reviews')
    .get(ctrlReviews.reviewsGetAll)
    .post(ctrlReviews.reviewsAddOne);

router
    .route('/hotels/:hotelID/reviews/:reviewID')
    .get(ctrlReviews.reviewsGetOne);

module.exports = router;