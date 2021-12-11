const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const { Owner } = require("../../models/OwnerModel");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    //authorization === Bearer ewefwegwrherhe
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.PRIVATE_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in" });
        }

        const { _id } = payload;
        Owner.findById(_id).then((userdata) => {
            req.owner = userdata;
            next();
        });
    });
};