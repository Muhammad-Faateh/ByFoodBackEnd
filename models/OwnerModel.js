const mongoose = require('mongoose');
const Joi = require('joi');
const bycrpt = require('bcryptjs');
const { RestaurantSchema } = require('./RestaurantModel');
const { NotificationSchema } = require("./NotificationModel");

const OwnerSchema = new mongoose.Schema({
    name: String,
    gender: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "Owner",
    },
    restaurant: RestaurantSchema,
    isRestaurantRejected: {
        type: Boolean,
        default: false,
    },
    isRestaurantDeleted: {
        type: Boolean,
        default: false,
    },
    restaurantStatus: {
        type: Boolean,
        default: false,
    },
    notifications: {
        type: [NotificationSchema],
        default: () => [],
    },
});

OwnerSchema.methods.encryptPassword = async function(password) {
    let hashPassword = await bycrpt.hash(password, 10);
    return hashPassword;
}
OwnerSchema.methods.decryptPassword = async function(password, hashPassword) {
    let validPassword = bycrpt.compare(password, hashPassword);
    return validPassword;
}

const validateOwner = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).trim().required(),
        gender: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        re_password: Joi.string().required()
    })
    return schema.validate(data);

}
const validateOwnerlogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
    return schema.validate(data);

}



const Owner = mongoose.model('Owner', OwnerSchema);

module.exports.OwnerSchema = OwnerSchema;
module.exports.Owner = Owner;
module.exports.validateOwner = validateOwner
module.exports.validateOwnerlogin = validateOwnerlogin