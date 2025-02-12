const app = require('../../app');
const { getAllBooks } = require('../managers/booksManager')

const getBooks = (req, res) => {
    try {
        const allBooks = getAllBooks()
        if (allBooks) {
            res.status(200).json(allBooks);

        } else {
            res.status(400).send("No se encontraron mangas");
        }

    } catch (error) {
        console.log("Error al obtener los libros", error);
        res.status(500).send("Error interno del servidor")
    }
}



module.exports = { getBooks }