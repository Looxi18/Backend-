import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import UserDTO from '../../dtos/user.dto.js';
import { sendPasswordResetEmail } from '../../services/mailer.service.js';
import UserRepository from '../../repositories/user.repository.js';
import { createHash, isValidPassword } from '../../utils/password.js';
const router = express.Router();


// Registro
router.post('/register', passport.authenticate('register', { session: false }), (req, res) => {
  res.status(201).json({ message: 'Usuario registrado con éxito' });
});

// Login
router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login exitoso',
    token
  });
});


router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userDto = new UserDTO(req.user);
  res.json({ user: userDto });
});





const userRepo = new UserRepository();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await userRepo.getUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  await sendPasswordResetEmail(email, token);
  res.json({ message: 'Correo de recuperación enviado' });
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepo.getUserByEmail(email);

    if (isValidPassword(newPassword, user.password)) {
      return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    const hashed = createHash(newPassword);
    await userRepo.changePassword(user._id, hashed);
    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
});

export default router;