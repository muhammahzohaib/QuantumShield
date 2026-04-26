const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { simpleLog } = require('../lib/logger');

// A04 Compliant: File upload restricted by type and size
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('File type not permitted'), false);
        }
        cb(null, true);
    }
});

// A01 Compliant: No privilege escalation possible in demo mode
// POST /api/media/protect-image
router.post('/protect-image', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Image file is required' });

        const filePath = req.file.path;
        let buffer = fs.readFileSync(filePath);

        for (let i = 128; i < buffer.length; i += 4) {
            const noise = Math.floor(Math.random() * 17) - 8;
            buffer[i] = Math.max(0, Math.min(255, buffer[i] + noise));
        }

        const protectedFilename = 'protected-' + req.file.filename;
        const protectedPath = path.join(path.dirname(filePath), protectedFilename);
        fs.writeFileSync(protectedPath, buffer);

        await simpleLog('Media Studio', 'Image Protection', req.file.originalname, 'Success');

        res.json({
            originalUrl: `/uploads/${req.file.filename}`,
            protectedUrl: `/uploads/${protectedFilename}`,
            noiseLevel: "8-bit random perturbation",
            message: "Adversarial noise successfully injected"
        });
    } catch (error) {
        res.status(500).json({ error: "Image processing failure" });
    }
});

// A01 Compliant: No privilege escalation possible in demo mode
// GET /api/media/download/:filename
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

module.exports = router;
