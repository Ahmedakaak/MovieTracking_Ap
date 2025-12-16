const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Proxy handler function
const proxyTMDb = async (req, res) => {
    try {
        // Build the endpoint from the request path
        const endpoint = req.path;

        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                ...req.query
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error('TMDb Proxy Error:', err.message);
        if (err.response) {
            res.status(err.response.status).json(err.response.data);
        } else {
            res.status(500).json({ msg: 'Server Error' });
        }
    }
};

// Specific routes for common endpoints
router.get('/trending/:media_type/:time_window', proxyTMDb);
router.get('/search/:search_type', proxyTMDb);
router.get('/movie/:id', proxyTMDb);
router.get('/tv/:id', proxyTMDb);

module.exports = router;
