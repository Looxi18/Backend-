import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js';
import productsApiRouter from './routes/api/products.api.routes.js';
import cartsApiRouter from './routes/api/carts.api.routes.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=> {
  console.log(`Server running on port http://localhost:${PORT}`)
});

const MONGO_URI = process.env.MONGO_URI

// Middleware
app.use(express.json());
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handlebars setup

const hbs = handlebars.create({
  helpers: {
    multiply: (a, b) => a * b
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'views');


// Routes
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/', viewsRouter);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sirve archivos estáticos desde ../public
app.use(express.static(path.join(__dirname, '..', 'public')));




// MongoDB Connection
mongoose.connect(MONGO_URI).then(()=>{
  console.log("MongoDB connected")
}).catch((err)=>console.log(err));



