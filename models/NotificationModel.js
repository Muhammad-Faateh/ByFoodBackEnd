const mongoose = require("mongoose");
const { UserSchema } = require("./user");

const NotificationSchema = new mongoose.Schema({
    message: String,
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports.NotificationSchema = NotificationSchema;
module.exports.Notification = Notification;