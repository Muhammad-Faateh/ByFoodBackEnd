const express = require('express');
const { MenuItem } = require('../models/MenuItemModel');
const { Owner } = require('../models/OwnerModel');
const { Restaurant } = require('../models/RestaurantModel');
const router = express.Router();

router.post("/restaurants", async(req, res) => {
    const owner = await Owner.findById({ _id: req.body._id });
    owner.isRestaurantRejected = false;
    owner.isRestaurantDeleted = false;
    owner.restaurantStatus = false;
    const restaurant = new Restaurant();
    restaurant.restaurantName = req.body.restaurant.restaurantName;
    restaurant.address = req.body.restaurant.address;
    restaurant.restaurantType = req.body.restaurant.restaurantType;
    restaurant.dineIn = req.body.restaurant.dineIn;
    restaurant.takeAway = req.body.restaurant.takeAway;
    restaurant.image = req.body.restaurant.image;

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
    await owner.save();
    res.status(200).send(owner);
});
router.put("/restaurants/:id", async(req, res) => {
    const owner = await Owner.findById({ _id: req.params.id });
    owner.restaurant.restaurantName = req.body.restaurantName;
    owner.restaurant.address = req.body.address;
    owner.restaurant.restaurantType = req.body.restaurantType;
    owner.restaurant.dineIn = req.body.dineIn;
    owner.restaurant.takeAway = req.body.takeAway;
    owner.restaurant.image = req.body.image;

    await owner.save();
    res.status(200).send(owner);
});

router.get("/restaurant/:id", async(req, res) => {
    const owner = await Owner.findOne({
        "restaurant._id": req.params.id,
    });
    if (owner.restaurant.reviews.length === 0) {
        owner.restaurant.rating = 0;
        await owner.save();
        res.status(200).send(owner.restaurant);
    } else {
        const ratings = owner.restaurant.reviews.map((review) => review.rating);
        owner.restaurant.rating =
            ratings.reduce((prevValue, curValue) => prevValue + curValue) /
            ratings.length;
        await owner.save();

        res.status(200).send(owner.restaurant);
    }
});
router.get("/restaurants", async(req, res) => {
    const owners = await Owner.find();
    const restaurants = owners.map((owner) => owner.restaurant).filter;
    const restaurantID = restaurants.filter(
        (restaurant) => restaurant !== undefined
    );
    res.status(200).send(restaurantID);
});

router.patch("/restaurantapproval/:id", async(req, res) => {
    try {
        const owner = await Owner.findById({ _id: req.params.id });
        owner.isRestaurantRejected = false;
        owner.isRestaurantDeleted = false;
        owner.restaurantStatus = req.body.approval;
        await owner.save();
        res.status(200).send(owner);
    } catch (error) {
        console.log(error);
    }
});
router.patch("/restaurantrejected/:id", async(req, res) => {
    try {
        const owner = await Owner.findById({ _id: req.params.id });
        owner.isRestaurantRejected = true;
        owner.isRestaurantDeleted = false;
        owner.restaurantStatus = false;
        await owner.save();
        res.status(200).send(owner);
    } catch (error) {
        console.log(error);
    }
});
router.delete("/restaurantdeleted/:id", async(req, res) => {
    const owner = await Owner.findByIdAndUpdate({ _id: req.params.id }, {
        $unset: {
            restaurant: "",
        },
    }, {
        new: true,
    });
    await owner.save();
    res.status(200).send(owner);
});
router.patch("/restaurantdeleted/:id", async(req, res) => {
    try {
        const owner = await Owner.findById({ _id: req.params.id });
        owner.isRestaurantDeleted = true;
        owner.restaurantStatus = false;
        owner.isRestaurantRejected = false;
        await owner.save();
        res.status(200).send(owner);
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;