import { connectDB } from '../../../lib/db.js';
import { protect, contributorOrAdmin } from '../../../lib/authMiddleware.js';
import { z } from 'zod';

const submitBlogSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  tags: z.string().optional(),
  coverImage: z.string().optional()
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      const Blog = (await import('../../../server/models/Blog.js')).default;
      const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
      return res.status(200).json(blogs);
    }

    if (req.method === 'POST') {
      try {
        await protect(req);
      } catch (err) {
        return res.status(401).json({ message: err.message });
      }

      try {
        contributorOrAdmin(req.user);
      } catch (err) {
        return res.status(403).json({ message: err.message });
      }

      const parsed = submitBlogSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Validation error', errors: parsed.error.errors });
      }

      const { title, excerpt, content, category, tags, coverImage } = parsed.data;

      const User = (await import('../../../server/models/User.js')).default;
      const userDoc = await User.findOne({ uid: req.user.uid });
      
      if (!userDoc || !userDoc.username) {
        return res.status(403).json({ message: 'You must set an author username before submitting a blog' });
      }

      const Blog = (await import('../../../server/models/Blog.js')).default;
      const blog = await Blog.create({
        title,
        excerpt,
        content,
        category,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        coverImage: coverImage || '',
        author: req.user.uid,
        authorName: userDoc.username,
        status: 'pending',
      });

      return res.status(201).json(blog);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
