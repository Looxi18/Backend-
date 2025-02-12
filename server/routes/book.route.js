const express = require("express");
const router = express.Router();
const { getBooks } = require("../controllers/book.controllers")

router.get("/", getBooks);


router.get("/:id", (req, res) => {
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
  

module.exports = router;