const express = require('express');
const router = express.Router();
const { getMe, setUsername } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// GET  /api/users/me          — get or create current user's profile
router.get('/me', protect, getMe);

// PATCH /api/users/me/username — set username once
router.patch('/me/username', protect, setUsername);

module.exports = router;
