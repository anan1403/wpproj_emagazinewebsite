const router = require("express").Router();
const Article = require("../models/Article");
const Magazine = require("../models/Magazine");
const auth = require("../middleware/authMiddleware");

// Create article
router.post("/", auth, async (req, res) => {
  try {
    const article = new Article({
      ...req.body,
      author: req.user.id
    });

    await article.save();

    // push into magazine
    await Magazine.findByIdAndUpdate(req.body.magazine, {
      $push: { articles: article._id }
    });

    res.json(article);

  } catch (err) {
    res.status(500).json(err);
  }
});

// Like article
const User = require("../models/User");

router.put("/like/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    const alreadyLiked = article.likes.includes(req.user.id);

    if (alreadyLiked) {
      // 🔻 UNLIKE
      article.likes.pull(req.user.id);
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { likedArticles: req.params.id }
      });
    } else {
      // 🔺 LIKE
      article.likes.push(req.user.id);
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { likedArticles: req.params.id }
      });
    }

    await article.save();
    res.json(article);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/magazine/:id", async (req, res) => {
  try {
    const articles = await Article.find({ magazine: req.params.id })
      .populate("author", "username");

    res.json(articles);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "username");
    res.json(article);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/author/:id", async (req, res) => {
  try {
    const articles = await Article.find({ author: req.params.id })
      .populate("magazine", "title");

    res.json(articles);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    const articles = await Article.find({
      title: { $regex: query, $options: "i" }
    });

    res.json(articles);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const magazines = await Magazine.find({
      category: req.params.category
    });

    const magazineIds = magazines.map(m => m._id);

    const articles = await Article.find({
      magazine: { $in: magazineIds }
    });

    res.json(articles);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/trending", async (req, res) => {
  try {
    const articles = await Article.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" }
        }
      },
      {
        $sort: { likesCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json(articles);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    console.log("FULL QUERY:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = 1;

    console.log("PAGE:", page);
    console.log("SKIP:", (page - 1) * limit);

    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("RESULT COUNT:", articles.length);

    res.json(articles);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;