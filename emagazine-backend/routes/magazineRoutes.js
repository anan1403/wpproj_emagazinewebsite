const router = require("express").Router();
const Magazine = require("../models/Magazine");
const auth = require("../middleware/authMiddleware");

// Create magazine
router.post("/", auth, async (req, res) => {
  try {
    const magazine = new Magazine({
      ...req.body,
      createdBy: req.user.id
    });

    await magazine.save();
    res.json(magazine);

  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all magazines
router.get("/", async (req, res) => {
  try {
    const magazines = await Magazine.find().populate("createdBy", "username");
    res.json(magazines);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    const magazines = await Magazine.find({
      title: { $regex: query, $options: "i" }
    });

    res.json(magazines);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get featured magazines
router.get("/featured", async (req, res) => {
  try {
    // Just returning 3 random/latest for now since there's no explicitly 'featured' boolean
    const magazines = await Magazine.find().sort({ createdAt: -1 }).limit(3);
    res.json(magazines);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get trending magazines
router.get("/trending", async (req, res) => {
  try {
    const magazines = await Magazine.find().limit(4); // Mock logic for trending
    res.json(magazines);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get single magazine
router.get("/:id", async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id).populate("createdBy", "username");
    if (!magazine) return res.status(404).json("Magazine not found");
    res.json(magazine);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;