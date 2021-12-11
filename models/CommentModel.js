const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new mongoose.Schema({
    title: String,
    text: String,
    postedBy: Object,
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports.CommentSchema = CommentSchema;
module.exports.Comment = Comment;