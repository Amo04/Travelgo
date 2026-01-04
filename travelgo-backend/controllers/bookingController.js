const db = require('../config/db');

exports.createBooking = async (req, res) => {
    const { trip_id } = req.body;
    const user_id = req.user.id;

    try {
        // Check seats
        const [trip] = await db.query('SELECT available_seats FROM trips WHERE id = ?', [trip_id]);
        if (trip.length === 0) return res.status(404).json({ message: 'Trip not found' });
        if (trip[0].available_seats <= 0) return res.status(400).json({ message: 'No seats available' });

        // Create Booking
        await db.query('INSERT INTO bookings (user_id, trip_id) VALUES (?, ?)', [user_id, trip_id]);

        // Decrement seats
        await db.query('UPDATE trips SET available_seats = available_seats - 1 WHERE id = ?', [trip_id]);

        res.status(201).json({ message: 'Booking confirmed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.*, t.title, t.price, d.name as destination, d.country 
             FROM bookings b 
             JOIN trips t ON b.trip_id = t.id 
             JOIN destinations d ON t.destination_id = d.id 
             WHERE b.user_id = ?`,
            [req.user.id]
        );
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.*, u.full_name, u.email, t.title 
             FROM bookings b 
             JOIN users u ON b.user_id = u.id 
             JOIN trips t ON b.trip_id = t.id 
             ORDER BY b.booking_date DESC`
        );
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Booking updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
