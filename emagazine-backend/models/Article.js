const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,

  magazine: { type: mongoose.Schema.Types.ObjectId, ref: "Magazine" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Article", ArticleSchema);