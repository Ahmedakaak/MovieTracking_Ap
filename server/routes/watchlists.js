const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', watchlistController.getWatchlists);
router.post('/', watchlistController.createWatchlist);
router.delete('/:id', watchlistController.deleteWatchlist);
router.post('/:id/items', watchlistController.addItem);
router.delete('/:id/items/:itemId', watchlistController.removeItem);
router.put('/:id/items/:itemId', watchlistController.updateItem);

module.exports = router;
