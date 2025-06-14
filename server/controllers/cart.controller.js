const app = require('../../app');
const { findBooksById } = require('../managers/booksManager');
const { createCart, deleteCart, getBooks, addBooks } = require('../managers/cartManager');


const newCart = (req, res) => {
    try {
        const cart = {
            "books": []
        }
        const newCart = createCart(cart)
        res.status(200).json(newCart);
    }
    catch {
        console.log("Error al crear el carrito")
        res.status(500).send("Error interno del servidor")
    }
}
//hola
const deleteCartById = (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const deleteCarts = deleteCart(id)
        res.status(200).json(deleteCarts);
    }
    catch {
        console.log("Error al eliminar carrito")
        res.status(500).send("Error interno del servidor")

    }
}


const getAllBooks = (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const books = getBooks(id)
        res.status(200).json(books);
    } catch {
        console.log("Error al obtener libros")
        res.status(500).send("Error interno del servidor")
    }
}



const addBookById = (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const bookId = parseInt(req.params.bookId)

        const book = findBooksById(bookId)
        const addBook = addBooks(book, id)
        res.status(200).json(addBook);
    } catch{
        console.log("Error al agregar libro")
        res.status(500).send("Error interno del servidor")
    }
}

const deleteBookById = (req, res)=>{
    try {
        const id = parseInt(req.params.id)
        const bookId = parseInt(req.params.bookId)

        const books = deleteBook(bookId, id)
        res.status(200).json(books);
        
    }catch{
        console.log("Error al eliminar libro")
        res.status(500).send("Error interno del servidor")
    }
}




module.exports = { newCart, deleteCartById, getAllBooks, addBookById, deleteBookById}