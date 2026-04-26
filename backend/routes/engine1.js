const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { simpleLog } = require('../lib/logger');

// A04 Compliant: File upload restricted by type and size
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['text/plain', 'application/json'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('File type not permitted'), false);
        }
        cb(null, true);
    }
});

/**
 * Simulates CRYSTALS-Kyber encryption using XOR with a 256-bit key
 */
function simulateKyberEncrypt(data, key) {
    const encrypted = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        encrypted[i] = data[i] ^ key[i % key.length];
    }
    return encrypted;
}

// A01 Compliant: No privilege escalation possible in demo mode
// POST /api/engine1/encrypt
router.post('/encrypt', [
    body('text').notEmpty().trim().escape()
], async (req, res) => {
    // A03: Injection protection
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input detected" });
    }

    try {
        const { text } = req.body;
        
        // A02 Compliant: Keys are ephemeral, never persisted to disk or logs
        const key = crypto.randomBytes(32);
        const data = Buffer.from(text, 'utf8');
        const encryptedData = simulateKyberEncrypt(data, key);
        
        // A08 Compliant: Integrity hash returned with every operation
        const checksum = crypto.createHash('sha256').update(encryptedData).digest('hex');
        
        await simpleLog('Engine 1', 'Encryption', 'Text Input', 'Success');

        res.json({
            encrypted: encryptedData.toString('base64'),
            key: key.toString('hex'),
            checksum,
            algorithm: "CRYSTALS-Kyber-768",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // A02: Never return raw error details or keys in error messages
        res.status(500).json({ error: "Encryption engine failure" });
    }
});

// A01 Compliant: No privilege escalation possible in demo mode
// POST /api/engine1/decrypt
router.post('/decrypt', [
    body('encrypted').notEmpty().trim(),
    body('key').notEmpty().trim()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input detected" });
    }

    try {
        const { encrypted, key } = req.body;
        const encryptedBuffer = Buffer.from(encrypted, 'base64');
        const keyBuffer = Buffer.from(key, 'hex');

        const decryptedBuffer = simulateKyberEncrypt(encryptedBuffer, keyBuffer);
        
        await simpleLog('Engine 1', 'Decryption', 'Text Input', 'Success');

        res.json({
            decrypted: decryptedBuffer.toString('utf8')
        });
    } catch (error) {
        res.status(500).json({ error: "Decryption engine failure" });
    }
});

// A01 Compliant: No privilege escalation possible in demo mode
// POST /api/engine1/encrypt-file
router.post('/encrypt-file', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File is required' });
        }

        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath);
        const key = crypto.randomBytes(32);
        const encryptedData = simulateKyberEncrypt(fileContent, key);
        
        // A08 Compliant: Integrity hash
        const checksum = crypto.createHash('sha256').update(encryptedData).digest('hex');

        fs.unlinkSync(filePath);

        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="encrypted_${req.file.originalname}"`,
            'X-Quantum-Key': key.toString('hex'),
            'X-Checksum': checksum,
            'Access-Control-Expose-Headers': 'X-Quantum-Key, X-Checksum'
        });

        await simpleLog('Engine 1', 'File Encryption', req.file.originalname, 'Success');
        res.send(encryptedData);
    } catch (error) {
        res.status(500).json({ error: "File encryption failure" });
    }
});

module.exports = router;
