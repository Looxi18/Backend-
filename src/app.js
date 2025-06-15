import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import viewsRouter from './routes/views.routes.js';
import productsApiRouter from './routes/api/products.api.routes.js';
import cartsApiRouter from './routes/api/carts.api.routes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import methodOverride from 'method-override';
import usersRoutes from './routes/users.routes.js'
import authRoutes from './routes/auth.routes.js';;
import initializePassport from './config/passport.config.js';
initializePassport();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hbs = exphbs.create({
  defaultLayout: false,
  helpers: {
    multiply: (a, b) => a * b
  }
});



const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
});

const MONGO_URI = process.env.MONGO_URI

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'tu_clave', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


// Handlebars setup

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));





// Routes
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/', viewsRouter);
app.use('/api/users', usersRoutes);
app.use('/', authRoutes);






// MongoDB Connection
mongoose.connect(MONGO_URI).then(() => {
  console.log("MongoDB connected")
}).catch((err) => console.log(err));




export default app;



