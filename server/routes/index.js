const express = require ("express");
const router = express.Router();
const books = require ("./book.route");
const app = require("../../app");

router.get ("/", function (req, res, next){
    res.send(
        `<div style= 'text-align: center; margin-top:20%'>
        <h1>¡Bienvenido a la api de Mangas!<h1/>
        <p>Para ver los mangas, dirigite a <a href= "http://localhost:8080/api/books">Mangas</a</p></div>`
    )
}
)


router.use ("/api/books", books)

router.get("/books/:id", (req, res) => {
    try {
        const { id } = req.params;

        const parseId = parseInt(id);
        if(isNaN(parseId)){
            return res.status(400).send("ID no valido")
        }


        const book = books.find((book) => book.id === parseInt(id));
        if (book) {
            res.status(200).json(book);
  
        } else {
            res.status(404).send("Libro no encontrado");
  
        }
    } catch (error) {
        console.error("error al obtener el libro:", error);
        res.status(500).send("Error interno del servidor")
    }
  })


  

module.exports=router;