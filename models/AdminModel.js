const mongoose = require("mongoose");
// const { MenuSchema } = require('./MenuItemModel');

const AdminSchema = new mongoose.Schema({
    restaurantName: String,
    address: String,
    restaurantType: String,
    dineIn: Boolean,
    takeAway: Boolean,
    image: String,
    menu: [MenuSchema],
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports.AdminSchema = AdminSchema;
module.exports.Admin = Admin;