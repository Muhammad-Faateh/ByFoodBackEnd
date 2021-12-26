const express = require("express");
const { MenuItem } = require("../models/MenuItemModel");
const { Owner } = require("../models/OwnerModel");
const { Restaurant } = require("../models/RestaurantModel");
const { Review } = require("../models/ReviewModel");
const { User } = require("../models/user");
const router = express.Router();

router.post("/createreview", async(req, res) => {
    const user = await User.findById({ _id: req.body.user._id });
    const review = new Review();
    review.rating = req.body.rating;
    review.message = req.body.message;
    review.user = user;

    const owner = await Owner.findOne({
        "restaurant._id": req.body.restaurantID,
    });
    const ratings = [
        ...owner.restaurant.reviews.map((review) => review.rating),
        req.body.rating,
    ];
    owner.restaurant.rating =
        ratings.reduce((prevValue, currentValue) => prevValue + currentValue) /
        ratings.length;

    owner.restaurant.reviews.push(review);

    await owner.save();
    res.status(200).send(owner);
});

router.put("/deletereview/:id", async(req, res) => {
    const { restaurantID } = req.body;
    const owner = await Owner.findOne({
        "restaurant._id": restaurantID,
    });
    const review = owner.restaurant.reviews.id({ _id: req.params.id });
    await review.remove();
    await owner.save();
    console.log(review);
    res.status(200).send("Success");
});

router.put("/editreview/:id", async(req, res) => {
    const user = await User.findById({ _id: req.body.user._id });
    const owner = await Owner.findOne({
        "restaurant._id": req.body.restaurantID,
    });
    const review = owner.restaurant.reviews.id(req.params.id);
    review.message = req.body.message;
    review.rating = req.body.rating;
    review.user = user;

    const ratings = [
        ...owner.restaurant.reviews.map((review) => review.rating),
        req.body.rating,
    ];
    owner.restaurant.rating =
        ratings.reduce((prevValue, currentValue) => prevValue + currentValue) /
        ratings.length;
    await owner.save();
    res.status(200).send(owner);
});

module.exports = router;