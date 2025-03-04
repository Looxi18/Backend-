const express = require("express");
const { newCart, deleteCartById, getAllBooks, addBookById, deleteBookById} = require("../controllers/cart.controller");
const router = express.Router();

router.post ("/", newCart)
router.delete ("/:id", deleteCartById)
router.get ("/:id", getAllBooks)
router.post ("/:id/books/:bookId", addBookById)
router.delete ("/:id/books/:bookId", deleteBookById )

module.exports = router;