const express = require('express');
const router = express.Router();
const { getMe, setUsername } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// GET  /api/users/me          — get or create current user's profile
router.get('/me', getMe);

// PATCH /api/users/me/username — set username once
router.patch('/me/username', setUsername);

module.exports = router;
