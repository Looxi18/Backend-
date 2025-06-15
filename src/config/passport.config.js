import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/password.js';


passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean(); // Lean para evitar problemas con Handlebars
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use('login', new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    console.log('[LOGIN] Email recibido:', email);
    console.log('[LOGIN] Password recibido:', password);

    const user = await User.findOne({ email });

    if (!user) {
      console.log('[LOGIN] Usuario no encontrado');
      return done(null, false, { message: 'Credenciales incorrectas (usuario)' });
    }

    const isValid = isValidPassword(password, user.password);
    console.log('[LOGIN] Password es válida?', isValid);

    if (!isValid) {
      console.log('[LOGIN] Contraseña incorrecta');
      return done(null, false, { message: 'Credenciales incorrectas (contraseña)' });
    }

    console.log('[LOGIN] Login exitoso');
    return done(null, user);
  } catch (err) {
    console.error('[LOGIN] Error en login:', err);
    return done(err);
  }
}));


const initializePassport = () => {
  // Registro
  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return done(null, false, { message: 'Usuario ya existe' });

      const hashedPassword = createHash(password);
      const newUser = new User({
        ...req.body,
        password: hashedPassword
      });

      const savedUser = await newUser.save();
      return done(null, savedUser);
    } catch (err) {
      return done(err);
    }
  }));

  // Login
  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user || !isValidPassword(password, user.password)) {
        return done(null, false, { message: 'Credenciales incorrectas' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Estrategia JWT
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id).populate('cart');
      if (!user) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};

export default initializePassport;
