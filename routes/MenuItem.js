const express = require('express');
const { MenuItem } = require('../models/MenuItemModel');
const { Owner } = require('../models/OwnerModel');
const { Restaurant } = require('../models/RestaurantModel');
const router = express.Router();

router.post('/menuitems', async(req, res) => {
    const item = new MenuItem();
    item.foodName = req.body.foodName
    item.description = req.body.description
    item.category = req.body.category
    item.price = req.body.price
    item.image = req.body.image
    await item.save();
    const owner = await Owner.findById({ _id: req.body.ownerid })
    owner.restaurant.menu.push(item)
    await owner.save()
    res.status(200).send(owner)
})
router.put('/menuitems/:id', async(req, res) => {
    const owner = await Owner.findById({ _id: req.body.ownerid });
    const item = await owner.restaurant.menu.id({ _id: req.params.id })
    item.foodName = req.body.foodName
    item.description = req.body.description
    item.category = req.body.category
    item.price = req.body.price
    item.image = req.body.image
    await item.save()
    await owner.save();
    res.status(200).send(owner)

})
router.put("/deleteitems/:id", async(req, res) => {
    const owner = await Owner.findById({ _id: req.body.id });
    const item = await owner.restaurant.menu.id({ _id: req.params.id });
    await item.remove();
    await owner.save();
    res.status(200).send(owner);
});

router.patch("/approvemenuitem/:id", async(req, res) => {
    const owner = await Owner.findById({ _id: req.body.ownerID });
    const item = await owner.restaurant.menu.id({ _id: req.params.id });
    item.status = "Approved";
    await item.save();
    await owner.save();
    res.status(200).send(owner);
});
router.patch("/rejectmenuitem/:id", async(req, res) => {
    const owner = await Owner.findById({ _id: req.body.ownerID });
    const item = await owner.restaurant.menu.id({ _id: req.params.id });
    item.status = "Rejected";
    await item.save();
    await owner.save();
    res.status(200).send(owner);
});



module.exports = router;