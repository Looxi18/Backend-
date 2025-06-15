import { requireRole } from '../middleware/auth.middleware.js';
import express from 'express';
const router = express.Router();
import User from '../models/user.model.js';
import  passport from'passport';


router.put(
  '/users/:uid/role',
  passport.authenticate('jwt', { session: false }),
  requireRole('admin'),
  async (req, res) => {
    const userId = req.params.uid;
    const { role } = req.body;

    const rolesValidos = ['user', 'admin'];
    if (!rolesValidos.includes(role)) {
      return res.status(400).json({ error: 'Rol no válido' });
    }

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      user.role = role;
      await user.save();

      res.json({ message: 'Rol actualizado', user });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar rol' });
    }
  }
);

export default router;
