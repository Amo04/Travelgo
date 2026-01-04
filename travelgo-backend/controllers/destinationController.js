const db = require('../config/db');

exports.getAllDestinations = async (req, res) => {
    try {
        const [destinations] = await db.query('SELECT * FROM destinations');
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getDestinationById = async (req, res) => {
    try {
        const [destinations] = await db.query('SELECT * FROM destinations WHERE id = ?', [req.params.id]);
        if (destinations.length === 0) return res.status(404).json({ message: 'Destination not found' });
        res.json(destinations[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createDestination = async (req, res) => {
    const { name, country, description, image_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO destinations (name, country, description, image_url) VALUES (?, ?, ?, ?)',
            [name, country, description, image_url]
        );
        res.status(201).json({ message: 'Destination added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateDestination = async (req, res) => {
    const { name, country, description, image_url } = req.body;
    try {
        await db.query(
            'UPDATE destinations SET name=?, country=?, description=?, image_url=? WHERE id=?',
            [name, country, description, image_url, req.params.id]
        );
        res.json({ message: 'Destination updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteDestination = async (req, res) => {
    try {
        await db.query('DELETE FROM destinations WHERE id = ?', [req.params.id]);
        res.json({ message: 'Destination deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
