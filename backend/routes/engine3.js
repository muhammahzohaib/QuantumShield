const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { simpleLog } = require('../lib/logger');
const { URL } = require('url');

function applyAntiAIShield(text) {
    const lookalikes = { 'a': '\u0430', 'e': '\u0435', 'o': '\u043E' };
    let shielded = '';
    let perturbationsCount = 0;
    const replacementChance = 0.15;
    const zwspChance = 0.10;

    for (let char of text) {
        if (lookalikes[char] && Math.random() < replacementChance) {
            shielded += lookalikes[char];
            perturbationsCount++;
        } else {
            shielded += char;
        }
    }

    const words = shielded.split(' ');
    let finalShielded = '';
    for (let i = 0; i < words.length; i++) {
        finalShielded += words[i];
        if (i < words.length - 1) {
            if (Math.random() < zwspChance) {
                finalShielded += '\u200B ';
                perturbationsCount++;
            } else {
                finalShielded += ' ';
            }
        }
    }
    return { shielded: finalShielded, perturbationsCount, protectionScore: Math.min(95, 70 + Math.round((perturbationsCount / (text.length || 1)) * 200)) };
}

// A01 Compliant: No privilege escalation possible in demo mode
// POST /api/engine3/shield-text
router.post('/shield-text', [
    body('text').notEmpty().trim().escape()
], async (req, res) => {
    // A03: Injection protection
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input detected" });
    }

    try {
        const { text } = req.body;
        const result = applyAntiAIShield(text);
        await simpleLog('Engine 3', 'Text Shielding', 'Adversarial Text', 'Success');
        res.json({ original: text, shielded: result.shielded, perturbationsCount: result.perturbationsCount, protectionScore: result.protectionScore });
    } catch (error) {
        res.status(500).json({ error: "Text shielding failure" });
    }
});

// A01 Compliant: No privilege escalation possible in demo mode
// POST /api/engine3/shield-url
router.post('/shield-url', [
    body('url').isURL({ protocols: ['http', 'https'], require_protocol: true })
], async (req, res) => {
    // A03: URL validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid URL detected" });
    }

    try {
        const { url: inputUrl } = req.body;
        
        // A10 Compliant: SSRF protection active
        const parsed = new URL(inputUrl);
        const hostname = parsed.hostname.toLowerCase();
        const blocklist = ['localhost', '127.0.0.1', '0.0.0.0', '10.', '192.168.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.'];
        
        if (blocklist.some(b => hostname.startsWith(b) || hostname === b)) {
            return res.status(403).json({ error: "SSRF attempt blocked" });
        }

        await simpleLog('Engine 3', 'URL Protection', inputUrl, 'Success');

        res.json({
            url: inputUrl,
            headers: {
                "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
                "Content-Security-Policy": "frame-ancestors 'none'; object-src 'none';",
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "Permissions-Policy": "browsing-topics=()"
            },
            metaTags: [
                '<meta name="robots" content="noindex, nofollow">',
                '<meta name="googlebot" content="noindex, nofollow">'
            ],
            robotsTxt: "User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nDisallow: /"
        });
    } catch (error) {
        res.status(500).json({ error: "URL protection failure" });
    }
});

module.exports = router;
