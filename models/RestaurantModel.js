const mongoose = require('mongoose');
const { MenuSchema } = require('./MenuItemModel');
const { ReviewSchema } = require("./ReviewModel");

const RestaurantSchema = new mongoose.Schema({
    restaurantName: String,
    address: String,
    restaurantType: String,
    dineIn: Boolean,
    takeAway: Boolean,
    image: String,
    menu: [MenuSchema],
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [ReviewSchema],
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports.RestaurantSchema = RestaurantSchema;
module.exports.Restaurant = Restaurant;