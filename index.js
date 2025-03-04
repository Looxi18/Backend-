const app = require("./app")
const PORT = 8081;
const express = require ("express")
const { createServer } = require('node:http');
const displayRoutes = require("express-routemap");
const handlebars = require("express-handlebars")
const { Server } = require('socket.io');
const { getAllBooks, addBooks } = require("./server/managers/booksManager");
const { log } = require("node:util");


const server = createServer(app);
const io = new Server(server);
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/views'))

app.get('/', (req, res)=>{
    res.render('index')
})

io.on('connection', (socket) => {
    console.log('a user connected');
    const books = getAllBooks()
    io.emit("books", books)
    socket.on("addBook", book => {
    addBooks(book)
    })
    
  });

server.listen(PORT,()=>{
    displayRoutes(app);
    console.log( `Server listening on port http://localhost:${PORT}`);
})
