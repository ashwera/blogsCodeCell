const User = require('../models/User');

// @route  GET /api/users/me
// @access Protected
// Gets (or creates) the current user's profile doc from MongoDB.
const getMe = async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      // First login — create the document without a username
      user = await User.create({ uid: req.user.uid, email: req.user.email });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PATCH /api/users/me/username
// @access Protected
// Sets the username exactly once. Rejects if already set.
const setUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string' || !username.trim())
      return res.status(400).json({ message: 'Username is required' });

    const cleaned = username.trim();

    // Validate: 3–30 chars, letters/numbers/underscores/hyphens only
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(cleaned))
      return res.status(400).json({
        message: 'Username must be 3–30 characters and contain only letters, numbers, _ or -',
      });

    let user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      user = await User.create({ uid: req.user.uid, email: req.user.email });
    }

    // Permanent — reject if already set
    if (user.username) {
      return res.status(409).json({ message: 'Username already set and cannot be changed' });
    }

    // Check uniqueness across all users
    const taken = await User.findOne({ username: cleaned });
    if (taken) {
      return res.status(409).json({ message: 'That username is already taken' });
    }

    user.username = cleaned;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMe, setUsername };
