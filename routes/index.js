/**
 * Created by Bilger on 14-Feb-17.
 */

const express = require('express');
const router = express.Router();

router
    .route('/json')
    .get(function(req, res){

        console.log('GET the json');

        res
            .status(200)
            .json(
                {
                    "jsonData": true
                }
            );
    })
    .post(function(req, res){

        console.log('POST the json');

        res
            .status(200)
            .json(
                {
                    "jsonData":"POST method used!"
                }
            )
    })
;

module.exports = router;