import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPasswordResetEmail = async (to, token) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: 'ecommerce@coder.com',
    to,
    subject: 'Restablece tu contraseña',
    html: `
      <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
      <a href="${resetLink}" style="padding:10px 20px;background:#007bff;color:white;text-decoration:none;">Restablecer Contraseña</a>
      <p>Este enlace expira en 1 hora.</p>
    `
  });
};
