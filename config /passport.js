const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const JWT_SECRET = 'tu_jwt_secreto'; // Mejor usar process.env.JWT_SECRET

// LOGIN: Estrategia local (email + password)
passport.use(new LocalStrategy({
  usernameField: 'email', // por defecto es "username"
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// PROTECCIÓN: Estrategia JWT para rutas privadas
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));
