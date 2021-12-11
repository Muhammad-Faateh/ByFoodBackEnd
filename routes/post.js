const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ownerlogin = require("../middleware/authentications/Ownerlogin");
const requireLogin = require("../middleware/requireLogin");
const { Comment } = require("../models/CommentModel");
const { Post } = require("../models/post");
// requireLogin
router.get("/allpost", async(req, res) => {
    const post = await Post.find();
    res.status(200).send(post);
});

router.post("/createpost", requireLogin, async(req, res) => {
    const { title, body, photo } = req.body;

    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user,
    });
    await post.save();
    res.status(200).send(post);
});
router.post("/createownerpost", Ownerlogin, async(req, res) => {
    const { title, body, photo } = req.body;

    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.owner,
    });
    await post.save();
    res.status(200).send(post);
});

router.post("/comments", requireLogin, async(req, res) => {
    const comment = new Comment();
    comment.title = req.body.title;
    comment.text = req.body.text;
    comment.postedBy = req.user;
    await comment.save();
    const post = await Post.findOne({ _id: req.body.postID });
    post.comments.push(comment);
    await post.save();
    res.status(200).send(post);
});
router.post("/ownercomments", Ownerlogin, async(req, res) => {
    const comment = new Comment();
    comment.title = req.body.title;
    comment.text = req.body.text;
    comment.postedBy = req.owner;
    await comment.save();
    const post = await Post.findOne({ _id: req.body.postID });
    post.comments.push(comment);
    await post.save();
    res.status(200).send(post);
});

router.get("/mypost", requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then((mypost) => {
            res.json({ mypost });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id,
    };
    Post.findByIdAndUpdate(
            req.body.postId, {
                $push: { comments: comment },
            }, {
                new: true,
            }
        )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            } else {
                res.json(result);
            }
        });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err });
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post
                    .remove()
                    .then((result) => {
                        res.json(result);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
});
module.exports = router;