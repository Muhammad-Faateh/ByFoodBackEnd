const mongoose = require('mongoose');
const { MenuSchema } = require('./MenuItemModel');

const RestaurantSchema = new mongoose.Schema({
    restaurantName: String,
    address: String,
    restaurantType: String,
    dineIn: Boolean,
    takeAway: Boolean,
    image: String,
    menu: [MenuSchema]
})

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports.RestaurantSchema = RestaurantSchema;
module.exports.Restaurant = Restaurant;