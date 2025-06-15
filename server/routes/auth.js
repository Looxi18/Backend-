const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = 'tu_jwt_secreto';

// Registro
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) return res.status(401).json({ error: info?.message || 'Login fallido' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  })(req, res, next);
});

// Ruta protegida
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ mensaje: 'Ruta protegida', usuario: req.user });
});

module.exports = router;
