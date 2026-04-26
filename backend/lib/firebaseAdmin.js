const admin = require('firebase-admin');

// In a real scenario, the user would provide a serviceAccountKey.json
// For now, we initialize with environment variables or placeholders
try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "your-email@your-project.iam.gserviceaccount.com",
                privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com"
        });
        console.log('Firebase Admin initialized successfully');
    }
} catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
}

const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage };
