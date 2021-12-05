const express = require('express');
const { MenuItem } = require('../models/MenuItemModel');
const { Owner } = require('../models/OwnerModel');
const { Restaurant } = require('../models/RestaurantModel');
const router = express.Router();

router.post('/restaurants', async(req, res) => {
    const owner = await Owner.findById({ _id: req.body._id })
    const restaurant = new Restaurant();
    restaurant.restaurantName = req.body.restaurant.restaurantName
    restaurant.address = req.body.restaurant.address
    restaurant.restaurantType = req.body.restaurant.restaurantType
    restaurant.dineIn = req.body.restaurant.dineIn
    restaurant.takeAway = req.body.restaurant.takeAway
    restaurant.image = req.body.restaurant.image

    const menuItem = new MenuItem();
    menuItem.foodName = req.body.menuItem.foodName;
    menuItem.description = req.body.menuItem.description;
    menuItem.category = req.body.menuItem.category;
    menuItem.price = req.body.menuItem.price;
    menuItem.image = req.body.menuItem.image;
    await menuItem.save();
    restaurant.menu.push(menuItem);
    await restaurant.save();

    owner.restaurant = restaurant;
    await owner.save()
    res.status(200).send(owner);

})
router.put('/restaurants/:id', async(req, res) => {
    const owner = await Owner.findById({ _id: req.params.id })
    owner.restaurant.restaurantName = req.body.restaurantName
    owner.restaurant.address = req.body.address
    owner.restaurant.restaurantType = req.body.restaurantType
    owner.restaurant.dineIn = req.body.dineIn
    owner.restaurant.takeAway = req.body.takeAway
    owner.restaurant.image = req.body.image

    await owner.save()
    res.status(200).send(owner);

})

router.get('/restaurant/:id', async(req, res) => {

    const owners = await Owner.find().select('restaurant')
    const restaurants = owners.map((owner) => owner.restaurant)
    const restaurantID = restaurants.filter((restaurant) => restaurant !== undefined).filter((restaurant) => restaurant._id == req.params.id)
    res.status(200).send(restaurantID[0])

})
module.exports = router;