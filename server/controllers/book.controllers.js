const { getAllBooks, findBooksById, deleteBooksById, addBooks, updateById } = require('../managers/booksManager')

const getBooks = (req, res) => {
    try {
        const allBooks = getAllBooks()
        if (allBooks) {
            res.render('home', {books: allBooks, empty: allBooks.length === 0 ? true : false})
        } else {
            res.status(400).send("No se encontraron mangas");
        }

    } catch (error) {
        console.log("Error al obtener los libros", error);
        res.status(500).send("Error interno del servidor")
    }
}



const getBooksById = (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const booksById = findBooksById(id)
        res.status(200).json(booksById);
    }
    catch{
        console.log("Error al encontrar libro")
        res.status(500).send("Error interno del servidor")
    }
}

const deleteBooks = (req, res) =>{
    try{
        const id = parseInt(req.params.id)
        const deleteBooks = deleteBooksById(id)
        res.status(200).json(deleteBooks);
    }
    catch{
        console.log("Error al eliminar libro")
        res.status(500).send("Error interno del servidor")

    }
}

const NewBook = (req, res)=>{
    try{
       const book = req.body
       const newBook = addBooks(book)
       res.status(200).json(newBook);
    }
    catch{

    }
}

const updateBook = (req, res)=>{
    try{
        const id = parseInt(req.params.id)
        const book = req.body
        const updatedBook = updateById(id, book)
        res.status(200).json(updatedBook);
    }catch{

    }
}

module.exports = { getBooks, getBooksById, deleteBooks, NewBook, updateBook}