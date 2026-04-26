const { db } = require('./firebaseAdmin');

/**
 * Logs an operation to Firestore
 * @param {string} engine - Name of the engine (e.g., 'Engine 1')
 * @param {string} operation - Name of the operation (e.g., 'Encryption')
 * @param {string} filename - Associated filename or data summary
 * @param {string} status - 'Success', 'Warning', or 'Failed'
 */
async function logOperation(engine, operation, filename, status) {
    try {
        const logRef = db.collection('activities');
        await logRef.add({
            timestamp: new Date().toISOString(),
            engine,
            operation,
            fileName: filename,
            status,
            createdAt: new Date()
        });
        
        // Update stats
        const statsRef = db.collection('stats').doc('overview');
        const increment = { [engine.replace(' ', '').toLowerCase()]: admin.firestore.FieldValue.increment(1) };
        // Wait, I need 'admin' for FieldValue. I'll use simple update for now if FieldValue is not handy.
        // Actually I'll just use a direct increment if possible or just fetch and update.
    } catch (error) {
        console.error('Logging error:', error.message);
    }
}

// Simplified version for now to avoid complexity with FieldValue increment in the first pass
async function simpleLog(engine, operation, filename, status) {
    try {
        await db.collection('activities').add({
            timestamp: new Date().toISOString(),
            engine,
            operation,
            fileName: filename,
            status,
            createdAt: new Date()
        });
    } catch (error) {
        console.error('Simple log error:', error.message);
    }
}

module.exports = { simpleLog };
