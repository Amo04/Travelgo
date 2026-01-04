const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);

// Admin Only
router.post('/', verifyToken, isAdmin, destinationController.createDestination);
router.put('/:id', verifyToken, isAdmin, destinationController.updateDestination);
router.delete('/:id', verifyToken, isAdmin, destinationController.deleteDestination);

module.exports = router;
