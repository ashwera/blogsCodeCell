const express = require('express');
const router = express.Router();
const { submitBlog, getMyBlogs, getAllBlogs, updateBlogStatus, getPublishedBlogs, getBlogById, getBlogStats } = require('../controllers/blogController');
const { protect, adminOnly, contributorOrAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPublishedBlogs);

// Static named routes MUST come before /:id to avoid Express treating 'mine', 'all', 'stats' as IDs
router.get('/mine', protect, contributorOrAdmin, getMyBlogs);
router.get('/all', protect, adminOnly, getAllBlogs);
router.get('/stats', protect, adminOnly, getBlogStats);

// Contributor routes
router.post('/', protect, contributorOrAdmin, submitBlog);

// Admin routes
router.patch('/:id/status', protect, adminOnly, updateBlogStatus);

// Parameterized routes LAST
router.get('/:id', getBlogById);

module.exports = router;
