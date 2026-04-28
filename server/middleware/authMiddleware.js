const admin = require('../config/firebaseAdmin');

// Protect route — requires valid Firebase ID Token
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      // decodedToken.name is only set for social (Google/etc) logins.
      // For email/password accounts we must fetch the user record.
      let displayName = decodedToken.name;
      if (!displayName) {
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        displayName = userRecord.displayName || decodedToken.email?.split('@')[0] || 'Contributor';
      }

      req.user = {
        _id: decodedToken.uid,
        uid: decodedToken.uid,
        name: displayName,
        email: decodedToken.email || null,
        picture: decodedToken.picture || null,
        isAdmin: decodedToken.admin === true
      };
      next();
    } catch (err) {
      console.error('Firebase Auth Error:', err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-only guard — requires admin custom claim set on the Firebase user
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
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
