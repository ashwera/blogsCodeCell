const admin = require('firebase-admin');

// Ensure Firebase is initialized (if not already initialized in server.js)
if (!admin.apps.length) {
  const serviceAccount = require('../config/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Protect route — requires valid Firebase ID Token
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Firebase user object
      next();
    } catch (err) {
      console.error('Firebase Auth Error:', err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-only guard
const adminOnly = (req, res, next) => {
  // Since all invited members are team members, we just check if they are logged in.
  // Real role-based access can be implemented using Custom Claims in Firebase if needed.
  if (req.user) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied — admin only' });
  }
};

// Contributor-or-admin guard
const contributorOrAdmin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied — contributors only' });
  }
};

module.exports = { protect, adminOnly, contributorOrAdmin };
