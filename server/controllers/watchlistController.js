const Watchlist = require('../models/Watchlist');

// Get all watchlists for a user
exports.getWatchlists = async (req, res) => {
    try {
        const watchlists = await Watchlist.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(watchlists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new watchlist
exports.createWatchlist = async (req, res) => {
    const { name } = req.body;
    try {
        const newWatchlist = new Watchlist({
            name,
            user: req.user.id,
            items: []
        });
        const watchlist = await newWatchlist.save();
        res.json(watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a watchlist
exports.deleteWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.findById(req.params.id);
        if (!watchlist) return res.status(404).json({ msg: 'Watchlist not found' });

        // Ensure user owns watchlist
        if (watchlist.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await watchlist.deleteOne();
        res.json({ msg: 'Watchlist removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add item to watchlist
exports.addItem = async (req, res) => {
    const { tmdbId, mediaType, title, posterPath, releaseDate, voteAverage } = req.body;
    try {
        const watchlist = await Watchlist.findById(req.params.id);
        if (!watchlist) return res.status(404).json({ msg: 'Watchlist not found' });

        if (watchlist.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Check if item already exists
        const exists = watchlist.items.some(item => item.tmdbId === tmdbId && item.mediaType === mediaType);
        if (exists) {
            return res.status(400).json({ msg: 'Item already in watchlist' });
        }

        watchlist.items.unshift({ tmdbId, mediaType, title, posterPath, releaseDate, voteAverage });
        await watchlist.save();
        res.json(watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Remove item from watchlist
exports.removeItem = async (req, res) => {
    try {
        const watchlist = await Watchlist.findById(req.params.id);
        if (!watchlist) return res.status(404).json({ msg: 'Watchlist not found' });

        if (watchlist.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Filter out the item
        watchlist.items = watchlist.items.filter(item => item._id.toString() !== req.params.itemId);
        await watchlist.save();
        res.json(watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update item (mark watched, rate, review)
exports.updateItem = async (req, res) => {
    const { watched, userRating, userReview } = req.body;
    try {
        const watchlist = await Watchlist.findById(req.params.id);
        if (!watchlist) return res.status(404).json({ msg: 'Watchlist not found' });

        if (watchlist.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const item = watchlist.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        if (watched !== undefined) item.watched = watched;
        if (userRating !== undefined) item.userRating = userRating;
        if (userReview !== undefined) item.userReview = userReview;

        await watchlist.save();
        res.json(watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
