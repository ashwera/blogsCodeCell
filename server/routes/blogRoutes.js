const express = require('express');
const router = express.Router();
const { submitBlog, getMyBlogs, getAllBlogs, updateBlogStatus, getPublishedBlogs, getBlogById, getBlogStats } = require('../controllers/blogController');
const { protect, adminOnly, contributorOrAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPublishedBlogs);
router.get('/:id([0-9a-fA-F]{24})', getBlogById);

// Default-deny for the rest
router.use(protect);

// Static named routes
router.get('/mine', contributorOrAdmin, getMyBlogs);
router.get('/all', adminOnly, getAllBlogs);
router.get('/stats', adminOnly, getBlogStats);

// Contributor routes
router.post('/', contributorOrAdmin, submitBlog);

// Admin routes
router.patch('/:id/status', adminOnly, updateBlogStatus);

module.exports = router;
