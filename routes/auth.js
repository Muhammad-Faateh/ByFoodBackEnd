const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");
const { User } = require("../models/user");

router.post("/signup", (req, res) => {
    const { name, email, password, gender } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res
                    .status(422)
                    .json({ error: "user already exists with that email" });
            }
            bcrypt.hash(password, 12).then((hashedpassword) => {
                const user = new User({
                    email,
                    password: hashedpassword,
                    name,
                    gender,
                });

                user
                    .save()
                    .then((user) => {
                        res.json({ message: "saved successfully" });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" });
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Email or password" });
        }
        bcrypt
            .compare(password, savedUser.password)
            .then((doMatch) => {
                if (doMatch) {
                    //res.json({message:"successfully signed in"})
                    const token = jwt.sign({ _id: savedUser._id, role: savedUser.role, name: savedUser.name },
                        JWT_SECRET
                    );
                    const { _id, name, email } = savedUser;
                    res.json({ token, user: { _id, name, email } });
                } else {
                    return res.status(422).json({ error: "Invalid Email or password" });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
});
router.patch("/forgotpassword/:id", async(req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });

        user.password = await user.encryptPassword(req.body.password);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
    }
});

router.get("/users", async(req, res) => {
    const users = await User.find();
    res.status(200).send(users);
});
module.exports = router;