const express = require('express');
const router = express.Router();
const { getItems, setItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getItems).post(protect, setItem);

module.exports = router;
