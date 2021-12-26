const express = require("express");
const { Notification } = require("../models/NotificationModel");
const { Owner } = require("../models/OwnerModel");
const { User } = require("../models/user");

const router = express.Router();

router.post("/createnotification", async(req, res) => {
    const notification = new Notification({ message: req.body.message });
    if (req.body.role === "Owner") {
        const owner = await Owner.findById({ _id: req.body.id });
        owner.notifications.push(notification);
        await owner.save();
        res.status(200).send(owner);
    } else {
        const user = await User.findById({ _id: req.body.id });
        user.notifications.push(notification);
        await user.save();
        res.status(200).send(user);
    }
});

module.exports = router;