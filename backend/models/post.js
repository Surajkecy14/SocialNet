const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imageUrl: String,
    caption: String,
    feeling: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // <-- This adds createdAt and updatedAt
);

module.exports = mongoose.model("Post", postSchema);