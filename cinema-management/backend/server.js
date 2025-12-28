const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'travelgo_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

// Auth routes
app.post('/register', async (req, res) => {
  const { nom, prenom, email, mot_de_passe } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  db.query('INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)', [nom, prenom, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User registered' });
  });
});

app.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;
  db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    const user = results[0];
    const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isValid) return res.status(401).json({ message: 'Invalid password' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  });
});

// CRUD for destinations (movies)
app.get('/destinations', verifyToken, (req, res) => {
  db.query('SELECT * FROM destinations', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/destinations', verifyToken, (req, res) => {
  const { titre, description, prix, categorie, localisation, image } = req.body;
  db.query('INSERT INTO destinations (titre, description, prix, categorie, localisation, image) VALUES (?, ?, ?, ?, ?, ?)', [titre, description, prix, categorie, localisation, image], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});

app.put('/destinations/:id', verifyToken, (req, res) => {
  const { titre, description, prix, categorie, localisation, image } = req.body;
  db.query('UPDATE destinations SET titre = ?, description = ?, prix = ?, categorie = ?, localisation = ?, image = ? WHERE id = ?', [titre, description, prix, categorie, localisation, image, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Updated' });
  });
});

app.delete('/destinations/:id', verifyToken, (req, res) => {
  db.query('DELETE FROM destinations WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Deleted' });
  });
});

// CRUD for reservations (bookings)
app.get('/reservations', verifyToken, (req, res) => {
  db.query('SELECT * FROM reservations WHERE utilisateur_id = ?', [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/reservations', verifyToken, (req, res) => {
  const { destination_id, date_debut, date_fin, nombre_personnes, prix_total } = req.body;
  db.query('INSERT INTO reservations (utilisateur_id, destination_id, date_debut, date_fin, nombre_personnes, prix_total) VALUES (?, ?, ?, ?, ?, ?)', [req.userId, destination_id, date_debut, date_fin, nombre_personnes, prix_total], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});

// Similar for other tables if needed

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});