const mongoose = require('mongoose');

const WatchlistItemSchema = new mongoose.Schema({
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], required: true },
    title: { type: String, required: true },
    posterPath: { type: String },
    voteAverage: { type: Number },
    releaseDate: { type: String },
    addedAt: { type: Date, default: Date.now },
    watched: { type: Boolean, default: false },
    userRating: { type: Number, min: 0, max: 10 },
    userReview: { type: String }
});

const WatchlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    items: [WatchlistItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
