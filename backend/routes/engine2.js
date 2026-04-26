const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const { simpleLog } = require('../lib/logger');

// A04 Compliant: File upload restricted by type and size
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv') {
            return cb(new Error('File type not permitted'), false);
        }
        cb(null, true);
    }
});

function generateLaplaceNoise(epsilon) {
    const sensitivity = 1;
    const scale = sensitivity / epsilon;
    const r = Math.random() - 0.5;
    const adjustedR = Math.abs(r) === 0.5 ? (Math.sign(r) * 0.499999) : r;
    return -scale * Math.sign(adjustedR) * Math.log(1 - 2 * Math.abs(adjustedR));
}

// A01 Compliant: No privilege escalation possible in demo mode
// POST /api/engine2/inject-noise
router.post('/inject-noise', [
    body('data').isArray().notEmpty().custom((val) => {
        if (!val.every(item => typeof item === 'number')) {
            throw new Error('Data array must contain only numbers');
        }
        return true;
    }),
    body('epsilon').isFloat({ min: 0.1, max: 10 })
], async (req, res) => {
    // A03: Injection protection
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input detected" });
    }

    try {
        const { data, epsilon } = req.body;
        const noisyData = data.map(value => {
            const numValue = Number(value);
            return isNaN(numValue) ? value : numValue + generateLaplaceNoise(epsilon);
        });

        const privacyScore = Math.round((1 - epsilon / 10) * 100);
        await simpleLog('Engine 2', 'Noise Injection', 'Numerical Data', 'Success');

        res.json({
            original: data,
            noisy: noisyData,
            epsilon,
            privacyScore
        });
    } catch (error) {
        res.status(500).json({ error: "Noise injection failure" });
    }
});

// A01 Compliant: No privilege escalation possible in demo mode
// POST /api/engine2/inject-noise-csv
router.post('/inject-noise-csv', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'CSV file is required' });

        const epsilon = parseFloat(req.body.epsilon) || 1.0;
        if (epsilon < 0.1 || epsilon > 10) return res.status(400).json({ error: "Invalid epsilon" });

        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const records = parse(fileContent, { columns: true, skip_empty_lines: true });

        const noisyRecords = records.map(record => {
            const newRecord = { ...record };
            for (const key in newRecord) {
                const val = parseFloat(newRecord[key]);
                if (!isNaN(val)) newRecord[key] = (val + generateLaplaceNoise(epsilon)).toFixed(4);
            }
            return newRecord;
        });

        const outputCsv = stringify(noisyRecords, { header: true });
        fs.unlinkSync(filePath);

        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="noisy_${req.file.originalname}"`
        });

        await simpleLog('Engine 2', 'CSV Noise Injection', req.file.originalname, 'Success');
        res.send(outputCsv);
    } catch (error) {
        res.status(500).json({ error: "CSV processing failure" });
    }
});

module.exports = router;
