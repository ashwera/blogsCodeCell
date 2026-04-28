const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/codecellblogs';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
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

// POST /events
app.post('/events', async (req, res) => {
  try {
    const { blog_id, type, time_spent } = req.body;
    if (!blog_id || !['view', 'read'].includes(type)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const event = new Event({
      blog_id: new mongoose.Types.ObjectId(blog_id),
      type,
      time_spent: type === 'read' ? time_spent : undefined,
      created_at: new Date()
    });

    await event.save();
    res.status(201).json({ message: 'Event logged' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /stats
app.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.month, 1);

    // 1. Total Views
    const totalViews = await Event.countDocuments({ type: 'view' });

    // 2. Views this month
    const viewsThisMonth = await Event.countDocuments({
      type: 'view',
      created_at: { $gte: startOfMonth }
    });

    // 3. Avg Read Time
    const avgReadResult = await Event.aggregate([
      { $match: { type: 'read', time_spent: { $exists: true } } },
      { $group: { _id: null, avgTime: { $avg: '$time_spent' } } }
    ]);
    const avgReadTime = avgReadResult.length > 0 ? parseFloat(avgReadResult[0].avgTime.toFixed(1)) : 0;

    // 4. Top Category
    const topCategoryResult = await Event.aggregate([
      { $match: { type: 'view' } },
      {
        $lookup: {
          from: 'blogs',
          localField: 'blog_id',
          foreignField: '_id',
          as: 'blog'
        }
      },
      { $unwind: '$blog' },
      { $group: { _id: '$blog.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const topCategory = topCategoryResult.length > 0 ? topCategoryResult[0]._id : 'N/A';

    res.json({
      total_views: totalViews,
      views_this_month: viewsThisMonth,
      avg_read_time: avgReadTime,
      top_category: topCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
