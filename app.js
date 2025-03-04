const express = require("express");
const app = express();
var logger = require ("morgan");

const books = require ("./server/data/books.json")


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




