const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect route — requires valid JWT
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'codecell_secret_key_fallback_123');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-only guard
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied — admin only' });
  }
};

// Contributor-or-admin guard
const contributorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'contributor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied — contributors only' });
  }
};

module.exports = { protect, adminOnly, contributorOrAdmin };
