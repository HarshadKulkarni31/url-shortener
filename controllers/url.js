const shortid = require('shortid');
const UrlModel = require('../models/url');

// ─── Blocked URL schemes ──────────────────────────────────────────────────────
const BLOCKED_SCHEMES = ['javascript:', 'file:', 'data:', 'vbscript:', 'blob:'];

function isValidUrl(url) {
  try {
    const parsed = new URL(url);

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    // Block dangerous schemes (extra safety)
    if (BLOCKED_SCHEMES.some((s) => url.toLowerCase().startsWith(s))) return false;

    // Block localhost/internal IPs in production
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname === '::1'
    ) {
      return false;
    }

    return true;
  } catch {
    return false; // Invalid URL format
  }
}

// ─── Shorten URL ──────────────────────────────────────────────────────────────
async function HandleGenerateNewShortUrl(req, res) {
  try {
    const body = req.body || {};
    const originalUrl = body.url || body.URL;

    // Check URL is provided
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required.' });
    }

    // Check URL length
    if (originalUrl.length > 2048) {
      return res.status(400).json({ error: 'URL is too long. Max 2048 characters.' });
    }

    // Validate URL
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL. Only http:// and https:// URLs are allowed.' });
    }

    const shortId = shortid();
    await UrlModel.create({
      shortId,
      redirectURL: originalUrl,
      visitHistory: [],
    });

    return res.json({ id: shortId });
  } catch (err) {
    console.error('Error creating short URL:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

// ─── Get Analytics ────────────────────────────────────────────────────────────
async function HandleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;

    if (!shortId) {
      return res.status(400).json({ error: 'Short ID is required.' });
    }

    const result = await UrlModel.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: 'Short URL not found.' });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

module.exports = {
  HandleGenerateNewShortUrl,
  HandleGetAnalytics,
};