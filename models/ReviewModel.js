const mongoose = require("mongoose");
const { UserSchema } = require("./user");

const ReviewSchema = new mongoose.Schema({
    rating: Number,
    message: String,
    user: UserSchema,
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports.ReviewSchema = ReviewSchema;
module.exports.Review = Review;