const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  created_at: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  type: { type: String, enum: ['view', 'read'] },
  time_spent: Number,
  created_at: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);
const Event = mongoose.model('Event', eventSchema);

async function seed() {
  require('dotenv').config({ path: '../.env' });
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/codecellblogs';
  await mongoose.connect(mongoURI);
  
  const existingBlogs = await Blog.find({});
  if (existingBlogs.length === 0) {
    console.log('No blogs found in codecellblogs database. Seed aborted.');
    process.exit();
  }

  const blogIds = existingBlogs.map(b => b._id);
  const sampleEvents = [];

  blogIds.forEach(id => {
    const viewCount = Math.floor(Math.random() * 20) + 5;
    for (let i = 0; i < viewCount; i++) {
      sampleEvents.push({ 
        blog_id: id, 
        type: 'view', 
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) 
      });
    }
  });

  if (sampleEvents.length > 0) {
    await Event.insertMany(sampleEvents);
    console.log(`Successfully seeded ${sampleEvents.length} events for ${existingBlogs.length} blogs.`);
  }
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
