const express = require("express");
const { Admin } = require("../models/AdminModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Owner } = require("../models/OwnerModel");

router.post("/signup", async(req, res) => {
    const admin = new Admin();
    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = await admin.encryptPassword(req.body.password);
    await admin.save();
    res.status(200).send(admin);
});

router.post("/login", async(req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        const isValid = await admin.decryptPassword(
            req.body.password,
            admin.password
        );
        if (isValid) {
            const token = jwt.sign({ admin }, process.env.PRIVATE_KEY);
            res.status(200).send(token);
        } else {
            res.status(400).send("Password Incorrect");
        }
    } catch (err) {
        res.status(400).send("Password Incorrect");
    }
});
router.get("/admins", async(req, res) => {
    const admins = await Admin.find();
    res.send(admins);
});
router.get("/restaurant/:id", async(req, res) => {
    const owner = await Owner.findById({ _id: req.params.id });
    res.status(200).send(owner.restaurant);
});

module.exports = router;