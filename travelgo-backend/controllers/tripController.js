const db = require('../config/db');

exports.getAllTrips = async (req, res) => {
    try {
        const query = req.query.destination_id
            ? 'SELECT * FROM trips WHERE destination_id = ?'
            : 'SELECT * FROM trips';
        const params = req.query.destination_id ? [req.query.destination_id] : [];

        const [trips] = await db.query(query, params);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const [trips] = await db.query('SELECT * FROM trips WHERE id = ?', [req.params.id]);
        if (trips.length === 0) return res.status(404).json({ message: 'Trip not found' });
        res.json(trips[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createTrip = async (req, res) => {
    const { destination_id, title, price, start_date, end_date, available_seats } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO trips (destination_id, title, price, start_date, end_date, available_seats) VALUES (?, ?, ?, ?, ?, ?)',
            [destination_id, title, price, start_date, end_date, available_seats]
        );
        res.status(201).json({ message: 'Trip added', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateTrip = async (req, res) => {
    const { title, price, start_date, end_date, available_seats } = req.body;
    try {
        await db.query(
            'UPDATE trips SET title=?, price=?, start_date=?, end_date=?, available_seats=? WHERE id=?',
            [title, price, start_date, end_date, available_seats, req.params.id]
        );
        res.json({ message: 'Trip updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        await db.query('DELETE FROM trips WHERE id = ?', [req.params.id]);
        res.json({ message: 'Trip deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
