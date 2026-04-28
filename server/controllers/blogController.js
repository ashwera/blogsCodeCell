const Blog = require('../models/Blog');
const User = require('../models/User');
const { z } = require('zod');

const submitBlogSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  tags: z.string().optional(),
  coverImage: z.string().optional()
});

// @route  POST /api/blogs
// @access Contributor + Admin
const submitBlog = async (req, res) => {
  try {
    const parsed = submitBlogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation error', errors: parsed.error.errors });
    }
    const { title, excerpt, content, category, tags, coverImage } = parsed.data;

    // Require a permanent username before allowing any submission
    const userDoc = await User.findOne({ uid: req.user.uid });
    if (!userDoc || !userDoc.username) {
      return res.status(403).json({ message: 'You must set an author username before submitting a blog' });
    }

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

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @route  GET /api/blogs/mine
// @access Contributor (own submissions only)
const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.uid }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @route  GET /api/blogs/all
// @access Admin only
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @route  PATCH /api/blogs/:id/status
// @access Admin only
const updateBlogStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['pending', 'published', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || '' },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @route  GET /api/blogs
// @access Public
const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @route  GET /api/blogs/:id
// @access Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @route  GET /api/blogs/stats
// @access Admin only
const getBlogStats = async (req, res) => {
  try {
    const [total, published, pending, rejected] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'pending' }),
      Blog.countDocuments({ status: 'rejected' }),
    ]);
    res.json({ total, published, pending, rejected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { submitBlog, getMyBlogs, getAllBlogs, updateBlogStatus, getPublishedBlogs, getBlogById, getBlogStats };
