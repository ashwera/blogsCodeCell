import { connectDB } from '../../../lib/db.js';
import { protect, contributorOrAdmin } from '../../../lib/authMiddleware.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

  try {
    await connectDB();
    const Blog = (await import('../../../server/models/Blog.js')).default;
    const blogs = await Blog.find({ author: req.user.uid }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
