const { adminAuth } = require('../firebase/admin');
const { admin } = require('../firebase/admin');
const db = admin.firestore();

/**
 * Middleware to verify the Firebase ID Token sent in the Authorization header.
 * A07 Compliant: Ensures all engine requests are authenticated.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No authentication token provided' 
      });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid or expired authentication token' 
    });
  }
};

/**
 * Middleware to restrict access based on user subscription roles.
 * Hierarchy: free < pro < enterprise
 */
const verifyRole = (requiredRole) => {
  const hierarchy = { free: 0, pro: 1, enterprise: 2 };
  
  return async (req, res, next) => {
    try {
      const userDoc = await db
        .collection('users')
        .doc(req.user.uid)
        .get();
      
      const userRole = userDoc.data()?.role || 'free';
      
      if (hierarchy[userRole] >= hierarchy[requiredRole]) {
        req.userRole = userRole;
        next();
      } else {
        return res.status(403).json({ 
          error: `This premium feature requires a ${requiredRole} plan or higher` 
        });
      }
    } catch (error) {
      console.error('Role check error:', error.message);
      return res.status(500).json({ error: 'Failed to verify user permissions' });
    }
  };
};

module.exports = { verifyToken, verifyRole };
