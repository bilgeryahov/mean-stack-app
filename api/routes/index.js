/**
 * Created by Bilger on 14-Feb-17.
 */

'use strict';

const express = require('express');
const router = express.Router();
const ctrlHotels = require('../controllers/hotels.controllers.js');


router
    .route('/hotels')
    .get(ctrlHotels.hotelsGetAll)
;

router
    .route('/hotels/:hotelID')
    .get(ctrlHotels.hotelsGetOne)
;

router
    .route('/hotels/new')
    .post(ctrlHotels.hotelsAddOne);

module.exports = router;