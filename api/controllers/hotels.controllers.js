/**
 * Created by Bilger on 14-Feb-17.
 */

'use strict';
const dbconnection = require('../data/dbconnection.js');
const hotelData = require('../data/hotel-data.json');
const ObjectId = require('mongodb').ObjectID;

module.exports.hotelsGetAll = function(req, res){

    let db = dbconnection.get();
    let collection = db.collection('hotels');

    let offset = 0;
    let count = 5;

    if(req.query && req.query.offset){

        offset = parseInt(req.query.offset, 10);
    }

    if(req.query && req.query.count){

        count = parseInt(req.query.count, 10);
    }

    collection
        .find()
        .skip(offset)
        .limit(count)
        .toArray(function(err, data){

            if(err){

                console.log(err);
                return;
            }

            res
                .status(200)
                .json(data);
        });
};

module.exports.hotelsGetOne = function(req, res){

    let db = dbconnection.get();
    let collection = db.collection('hotels');

    let hotelID = req.params.hotelID;

    collection
        .findOne({
            _id: ObjectId(hotelID)
        }, function(err, data){

            if(err){

                console.log(err);
                return;
            }

            res
                .status(200)
                .json(data);
        });

};

module.exports.hotelsAddOne = function(req, res){

  console.log('POST new hotel');
  console.log(req.body);

  res
      .status(201)
      .json(req.body);
};