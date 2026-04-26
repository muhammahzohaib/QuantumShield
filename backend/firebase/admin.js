const admin = require('firebase-admin');

// A service account JSON is required for admin initialization
// In production, use environment variables or a secure path to the key file
try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n'),
            })
        });
        console.log('Firebase Admin initialized');
    }
} catch (error) {
    console.error('Firebase Admin init error:', error.message);
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

module.exports = { admin, adminAuth, adminDb };
