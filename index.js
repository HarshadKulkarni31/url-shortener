require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { connectToMongoDB } = require('./connect');
const urlRoutes = require('./routes/url');
const URL = require('./models/url');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectToMongoDB(process.env.MONGO_URL || 'mongodb://localhost:27017/URLShortener')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Stop server if DB fails
  });

const app = express();
const port = process.env.PORT || 8001;

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Keep false so UI loads correctly
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 20,                  // Max 20 requests per IP per minute
  message: { error: 'Too many requests. Please wait a minute and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/url', limiter); // Apply only to API routes

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limit request body size
app.use(express.static(path.join(__dirname, 'public')));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/url', urlRoutes);

// ─── Redirect Short URL ───────────────────────────────────────────────────────
app.get('/:shortId', async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    );

    if (!entry) return res.status(404).json({ error: 'Short URL not found' });

    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(port, () => console.log(`Server is running on PORT: ${port}`));
