const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Magazine = require('./models/Magazine');
const Article = require('./models/Article');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany({});
    await Magazine.deleteMany({});
    await Article.deleteMany({});

    console.log('Cleared existing data...');

    // Seed User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      username: 'Jane Doe',
      email: 'test@example.com',
      password: hashedPassword
    });
    await user.save();
    console.log('Created test user: test@example.com / password123');

    // Categories
    const categories = ['Technology', 'Business', 'Fashion', 'Lifestyle', 'Travel', 'Science'];

    const magNames = [
      "Wired DeepTech", "Forbes Innovators", "Vogue Essentials", 
      "GQ Modern Life", "National Geo Explorers", "Nature's Quantum",
      "TechCrunch Weekly", "Harvard Business Review", "Elle Haute Couture",
      "Kinfolk Simplicity", "Condé Nast Traveler", "Scientific American"
    ];

    // Seed Magazines
    const magazines = [];
    for (let i = 0; i < 12; i++) {
      const mag = new Magazine({
        title: magNames[i],
        description: 'An exciting dive into the latest trends and stories. Hand-curated for premium modern aesthetics.',
        coverImage: `https://picsum.photos/seed/mag${i}/400/600`,
        category: categories[i % categories.length],
        createdBy: user._id
      });
      await mag.save();
      magazines.push(mag);
    }
    console.log(`Created ${magazines.length} magazines.`);

    // Seed Articles
    for (const mag of magazines) {
      for (let j = 0; j < 3; j++) {
        const articleTitles = [
          `The Future of ${mag.category}: Trends to Watch`,
          `Deep Dive: Understanding the Nuances of ${mag.category}`,
          `10 Secrets the ${mag.category} Industry Doesn't Want You to Know`
        ];

        const article = new Article({
          title: articleTitles[j],
          content: 'This is a detailed mock content text for the seeded article. It explains various theories and practical applications in deep detail...',
          image: `https://picsum.photos/seed/art${mag._id}${j}/800/400`,
          magazine: mag._id,
          author: user._id,
          likes: j === 0 ? [user._id] : []
        });
        
        await article.save();
        
        // Push article into Magazine
        mag.articles.push(article._id);

        if (j === 0) {
          user.likedArticles.push(article._id);
          user.bookmarks.push(article._id);
          user.history.push(article._id);
        }
      }
      await mag.save();
      user.subscriptions.push(mag._id);
    }

    await user.save();
    console.log('Created articles and linked relationships.');

    console.log('\n✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
