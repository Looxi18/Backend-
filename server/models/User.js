const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersPath = path.join(__dirname, '../data/users.json');

let users = [];
if (fs.existsSync(usersPath)) {
  users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}

const getUsers = () => users;

const saveUsers = () => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

const createUser = (userData) => {
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) throw new Error('Email ya registrado');

  const hashedPassword = bcrypt.hashSync(userData.password, 10);
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...userData,
    password: hashedPassword,
    role: userData.role || 'user',
    cart: null
  };

  users.push(newUser);
  saveUsers();
  return newUser;
};

const findUserByEmail = (email) => users.find(user => user.email === email);

const findUserById = (id) => users.find(user => user.id === id);

module.exports = {
  getUsers,
  createUser,
  findUserByEmail,
  findUserById
};
