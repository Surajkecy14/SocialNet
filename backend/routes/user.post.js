const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const verifyToken = require("../middleware/auth");

router.post("/create", verifyToken, async (req, res) => {
  const { imageUrl, caption, feeling } = req.body;

  try {
    // Check if imageUrl already exists
    const existingPost = await Post.findOne({ imageUrl });
    if (existingPost) {
      return res.status(409).json({ message: "Post already created" });
    }
    const post = await Post.create({
      imageUrl,
      caption,
      feeling,
      user: req.userId,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json("server side error");
  }
});
router.post("/delete", verifyToken, async (req, res) => {
  const { id } = req.body;
  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: id,
      user: req.userId,
    });
    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: "Post not found or not authorized" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("server side error");
  }
});

router.post("/edit", verifyToken, async (req, res) => {
  const { id, caption, feeling, imageUrl } = req.body;
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, user: req.userId },
      { caption, feeling, imageUrl },
      { new: true }
    );
    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "Post not found or not authorized" });
    }
    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json("server side error");
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user", "username")
      .sort({ createdAt: -1 }); // Sort by latest
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json("server side error");
  }
});

module.exports = router;
