const mongoose = require("mongoose");

const MagazineSchema = new mongoose.Schema({
  title: String,
  description: String,
  coverImage: String,
  category: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }]
}, { timestamps: true });

module.exports = mongoose.model("Magazine", MagazineSchema);