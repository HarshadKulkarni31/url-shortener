const express = require('express');
const {HandleGenerateNewShortUrl,HandleGetAnalytics} = require('../controllers/url');
const router= express.Router();

router.post("/", HandleGenerateNewShortUrl);

router.get("/analytics/:shortId", HandleGetAnalytics);

module.exports= router;
