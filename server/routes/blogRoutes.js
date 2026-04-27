const express = require('express');
const router = express.Router();
const { submitBlog, getMyBlogs, getAllBlogs, updateBlogStatus } = require('../controllers/blogController');
const { protect, adminOnly, contributorOrAdmin } = require('../middleware/authMiddleware');

// Contributor routes
router.post('/', protect, contributorOrAdmin, submitBlog);
router.get('/mine', protect, contributorOrAdmin, getMyBlogs);

// Admin routes
router.get('/all', protect, adminOnly, getAllBlogs);
router.patch('/:id/status', protect, adminOnly, updateBlogStatus);

module.exports = router;
