

import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'claveSuperSecreta';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS   
  }
});

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Usuario no encontrado');

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

  const resetUrl = `http://localhost:3000/auth/reset-password/${token}`;

  await transporter.sendMail({
    from: `"Tienda Mangas" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Restablecer tu contraseña',
    html: `<p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetUrl}">Restablecer contraseña</a>`
  });
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new Error('Las contraseñas no coinciden');
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findOne({ email: decoded.email });
  if (!user) throw new Error('Usuario no encontrado');

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) throw new Error('La nueva contraseña no puede ser igual a la anterior');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};
