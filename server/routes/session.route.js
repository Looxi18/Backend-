const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/User');

const JWT_SECRET = "supersecreto123"; // En producción usar dotenv

// Registro
router.post('/register', (req, res) => {
  try {
    const user = createUser(req.body);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

  const match = bcrypt.compareSync(password, user.password);
  if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login exitoso', token });
});

// Current user (con token en headers)
router.get('/current', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token no enviado' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserByEmail(decoded.email) || findUserById(decoded.id);
    if (!user) throw new Error('Usuario no encontrado');
    res.json({ user });
  } catch (err) {
    res.status(403).json({ error: 'Token inválido' });
  }
});

module.exports = router;
