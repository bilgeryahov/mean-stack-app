const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        "default": 0
    },
    review: {
        type: String,
        required: true
    },
    createdOn:{
        type: Date,
        "default": Date.now()
    }
});

const roomSchema = new mongoose.Schema({
    type: String,
    number: Number,
    description: String,
    photos: [String],
    price: Number
});

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        "default": "Hotel"
    },
    stars: {
        type: Number,
        min: 0,
        max: 5,
        "default": 0
    },
    services: [String],
    description: {
        type: String,
        "default": "No description"
    },
    photos: [String],
    currency: {
        type: String,
        "default": "Not specified"
    },
    reviews: [reviewSchema],
    rooms: [roomSchema],
    location: {
        address: {
            type: String,
            "default": "Not specified"
        },
        // Always store coordinates longitude E/W, latitude N/S order
        coordinates: {
            type: [Number],
            index: '2dsphere',
            "default": [0,0]
        }
    }
});

mongoose.model('Hotel', hotelSchema);