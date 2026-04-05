const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");


// 🔔 Subscribe / Unsubscribe Author
router.put("/subscribe/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.subscriptions.includes(req.params.id)) {
      // unsubscribe
      user.subscriptions.pull(req.params.id);
    } else {
      // subscribe
      user.subscriptions.push(req.params.id);
    }

    await user.save();
    res.json(user);

  } catch (err) {
    res.status(500).json(err);
  }
});


// 🔖 Bookmark Article
router.put("/bookmark/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.bookmarks.includes(req.params.id)) {
      user.bookmarks.pull(req.params.id);
    } else {
      user.bookmarks.push(req.params.id);
    }

    await user.save();
    res.json(user);

  } catch (err) {
    res.status(500).json(err);
  }
});


// ❤️ Get liked articles
router.get("/liked", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "likedArticles",
        model: "Article"
      });

    console.log("USER:", user); // debug

    res.json(user.likedArticles);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// 📚 Add to history
router.put("/history/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { history: req.params.id }
    });

    res.json({ message: "Added to history" });

  } catch (err) {
    res.status(500).json(err);
  }
});

// 📌 Get Profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📌 Update Profile
router.put("/profile", auth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username: req.body.username },
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📌 Get Subscriptions
router.get("/subscriptions", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("subscriptions");
    res.json(user.subscriptions);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📌 Get Bookmarks
router.get("/bookmarks", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("bookmarks");

    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json(err);
  }
});


// 📌 Get History
router.get("/history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("history");

    res.json(user.history);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🗑️ Remove from history
router.delete("/history/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { history: req.params.id }
    });
    res.json({ message: "Removed from history" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;