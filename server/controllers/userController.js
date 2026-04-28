const User = require('../models/User');
const { z } = require('zod');

const usernameSchema = z.object({
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Username must contain only letters, numbers, _ or -')
});

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
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @route  PATCH /api/users/me/username
// @access Protected
// Sets the username exactly once. Rejects if already set.
const setUsername = async (req, res) => {
  try {
    const parsed = usernameSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Username must be 3–30 characters and contain only letters, numbers, _ or -',
        errors: parsed.error.errors
      });
    }

    const cleaned = parsed.data.username;

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
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getMe, setUsername };
