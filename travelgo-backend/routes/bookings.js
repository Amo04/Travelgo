const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, bookingController.createBooking);
router.get('/', verifyToken, bookingController.getUserBookings);
router.get('/all', verifyToken, isAdmin, bookingController.getAllBookings);
router.put('/:id', verifyToken, isAdmin, bookingController.updateBookingStatus);

module.exports = router;
