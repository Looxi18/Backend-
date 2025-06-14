const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {
  getUsers,
  findUserById,
  findUserByEmail,
  createUser
} = require('../models/User');

// Obtener todos los usuarios
router.get('/', (req, res) => {
  const users = getUsers();
  res.json(users);
});

// Obtener usuario por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = findUserById(id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});

// Actualizar usuario
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  const updatedUser = {
    ...users[index],
    ...req.body,
  };

  // Si incluye nueva contraseña, hashearla
  if (req.body.password) {
    updatedUser.password = bcrypt.hashSync(req.body.password, 10);
  }

  users[index] = updatedUser;

  const fs = require('fs');
  const path = require('path');
  fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2));
  res.json({ message: 'Usuario actualizado', user: updatedUser });
});

// Eliminar usuario
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let users = getUsers();
  const exists = users.some(u => u.id === id);
  if (!exists) return res.status(404).json({ error: 'Usuario no encontrado' });

  users = users.filter(u => u.id !== id);

  const fs = require('fs');
  const path = require('path');
  fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2));

  res.json({ message: 'Usuario eliminado' });
});

module.exports = router;
