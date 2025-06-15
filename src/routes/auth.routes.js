import { Router } from 'express';
import passport from 'passport';
import { sendResetEmail, resetPassword } from '../controllers/auth.controller.js';


const router = Router();


router.post('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});


// Login con Passport
router.post('/auth/login', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // Autenticación fallida
      return res.render('login', { title: 'Iniciar sesión', error: info?.message || 'Credenciales inválidas' });
    }

    // Autenticación exitosa: loguear al usuario en sesión
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});


// Registro (podés usar Passport o tu lógica personalizada)
router.post('/auth/register', async (req, res) => {
  res.redirect('/login');
});

// Solicitud de recuperación
router.post('/auth/reset-password-request', async (req, res) => {
  const { email } = req.body;
  await sendResetEmail(email);
  res.send('Correo de recuperación enviado');
});

// Restablecer contraseña
router.post('/auth/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;
  await resetPassword(token, newPassword, confirmPassword);
  res.redirect('/login');
});

export default router;
