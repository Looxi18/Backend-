const express = require("express");
const app = express();
var logger = require ("morgan");

const books = require ("./server/data/books.json")


const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
require('./config/passport');

const app = express();
app.use(express.json());
app.use(passport.initialize());

mongoose.connect('mongodb://localhost/miapp', { useNewUrlParser: true, useUnifiedTopology: true });

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));





//MidelWares
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(logger("dev"));




//Cors config
app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers","Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
})

//Endpoints

const routes = require ("./server/routes/index")
app.use("/", routes);




module.exports = app




