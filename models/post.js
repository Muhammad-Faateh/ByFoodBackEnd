const mongoose = require('mongoose')
const { CommentSchema } = require("./CommentModel");
const { ObjectId } = mongoose.Schema.Types;
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    postedBy: {
        type: Object,
    },
    // postedByOwner: {
    //     type: ObjectId,
    //     ref: "Owner",
    // },
    comments: [CommentSchema],
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
module.exports.Post = Post;
module.exports.PostSchema = PostSchema;