const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,

  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Magazine" }],
  likedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
