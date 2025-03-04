const express = require("express");
const router = express.Router();
const { getBooks, getBooksById, deleteBooks, NewBook, updateBook } = require("../controllers/book.controllers");

router.get("/", getBooks);

router.get ("/:id", getBooksById)

router.delete ("/:id", deleteBooks)

router.post ("/", NewBook)

router.put ("/:id",  updateBook)

  

module.exports = router;