const books = require("../data/books.json");
const fs = require("fs")

const getAllBooks = () => {
  return books.length ? books : null
};


const findBooksById = (id) => {
  const filteredBooks = books.find(book => book.id === id)
  if (filteredBooks) {

    return filteredBooks

  } else {
    return console.log("No se encontro el libro")
  }
}


const deleteBooksById = (id) => {
  const filteredBooks = books.find(book => book.id === id)
  if (filteredBooks) {
    try {
      const filterBooks = books.filter(book => book.id !== id)
      fs.writeFileSync("/workspaces/Backend-/server/data/books.json", JSON.stringify(filterBooks))
    }
    catch (error) {
      console.log(error)
    }

  }

}

const addBooks = (book) => {
  let id
  books.length == 0 ? (id = 1) : (id = books[books.length - 1].id + 1)
  const newBook = { id, ...book }
  const data = books
  data.push(newBook)
  fs.writeFileSync("/workspaces/Backend-/server/data/books.json", JSON.stringify(data))
  return newBook
}

const updateById = (id, book) => {
  const findBook = books.find(book => book.id === id)
  if (findBook) {
    const filterBooks = books.filter(book => book.id !== id)
    const newBook = {id, ...book}
    filterBooks.push(newBook)
    fs.writeFileSync("/workspaces/Backend-/server/data/books.json", JSON.stringify(filterBooks))
  }
}




module.exports = { getAllBooks, findBooksById, deleteBooksById, addBooks, updateById }; 