const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);

// Admin Only
router.post('/', verifyToken, isAdmin, tripController.createTrip);
router.put('/:id', verifyToken, isAdmin, tripController.updateTrip);
router.delete('/:id', verifyToken, isAdmin, tripController.deleteTrip);

module.exports = router;
