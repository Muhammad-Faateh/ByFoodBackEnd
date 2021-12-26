const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    foodName: String,
    description: String,
    category: String,
    price: Number,
    image: String,
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
});

const MenuItem = mongoose.model('MenuItem', MenuSchema);

module.exports.MenuSchema = MenuSchema;
module.exports.MenuItem = MenuItem;