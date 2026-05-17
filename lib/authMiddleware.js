import admin from './firebaseAdmin.js';

export async function protect(req) {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
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
      
      return req.user;
    } catch (err) {
      console.error('Firebase Auth Error:', err);
      throw new Error('Not authorized, token failed');
    }
  } else {
    throw new Error('Not authorized, no token');
  }
}

export function adminOnly(user) {
  if (!user || user.isAdmin !== true) {
    throw new Error('Access denied - admin only');
  }
}

export function contributorOrAdmin(user) {
  if (!user) {
    throw new Error('Access denied - contributors only');
  }
}
