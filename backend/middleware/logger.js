const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/access.log');

const logger = (req, res, next) => {
    // A09 Compliant: Structured logging active, no sensitive data in logs
    res.on('finish', () => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            status: res.statusCode
        };

        try {
            fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        } catch (err) {
            console.error('Failed to write to access log:', err.message);
        }
    });
    next();
};

module.exports = logger;
