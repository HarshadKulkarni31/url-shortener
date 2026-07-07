const shortid = require('shortid');
const URL= require('../models/url');

async function HandleGenerateNewShortUrl(req, res) {
    const body = req.body || {};
    const originalUrl = body.url || body.URL;

    if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectURL: originalUrl,
        visitHistory: []
    });

    return res.json({ id: shortId });
}

async function HandleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
}
module.exports = {
    HandleGenerateNewShortUrl,
    HandleGetAnalytics,
};