const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const bycrpt = require("bcryptjs");
const { NotificationSchema } = require("./NotificationModel");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: String,
    role: {
        type: String,
        default: "User",
    },
    notifications: {
        type: [NotificationSchema],
        default: () => [],
    },
});
UserSchema.methods.encryptPassword = async function(password) {
    let hashPassword = await bycrpt.hash(password, 10);
    return hashPassword;
};
const User = mongoose.model("User", UserSchema);
module.exports.User = User;
module.exports.UserSchema = UserSchema;