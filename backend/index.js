require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const logger = require('./middleware/logger');

const engine1Router = require('./routes/engine1');
const engine2Router = require('./routes/engine2');
const engine3Router = require('./routes/engine3');
const mediaRouter = require('./routes/media');

const app = express();
const PORT = process.env.PORT || 5000;

// A05: Security Misconfiguration - Helmet setup
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"]
  }
}));

// A02: Cryptographic Failures - Force HSTS
app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// A07: Authentication Failures - Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Slow down." },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', globalLimiter);

const engineLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Engine rate limit reached. Wait 1 minute." }
});
app.use('/api/engine1', engineLimiter);
app.use('/api/engine2', engineLimiter);
app.use('/api/engine3', engineLimiter);
app.use('/api/media', engineLimiter);

// A09: Logging and Monitoring
app.use(logger);

app.use(cors());
app.use(express.json());
app.use(xss()); // Data Sanitization against XSS
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// A01: Broken Access Control - Block private paths
app.use(['/admin', '/internal', '/config'], (req, res) => {
    res.status(403).json({ error: "Access denied" });
});

const { verifyToken, verifyRole } = require('./middleware/auth');

// A06 Compliant: Run npm audit before each deployment
// Mount the routers with authentication and role gating
app.use('/api/engine1', verifyToken, engine1Router);
app.use('/api/engine2', verifyToken, verifyRole('pro'), engine2Router);
app.use('/api/engine3', verifyToken, verifyRole('pro'), engine3Router);
app.use('/api/media', verifyToken, verifyRole('enterprise'), mediaRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Quantum-Safe API Server is running' });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
