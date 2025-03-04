const { parse } = require("path")
const carts = require("../data/carts.json")
const fs = require("fs")

const createCart = (cart) => {
  let id
  carts.length == 0 ? (id = 1) : (id = carts[carts.length - 1].id + 1)

  const newCart = { id, ...cart }
  const data = carts
  data.push(newCart)
  fs.writeFileSync("/workspaces/Backend-/server/data/carts.json", JSON.stringify(data))
}



const deleteCart = (id) => {
  const findCart = carts.find(cart => cart.id === id)
  if (findCart) {
    const filterCart = carts.filter(cart => cart.id !== id)
    fs.writeFileSync("/workspaces/Backend-/server/data/carts.json", JSON.stringify(filterCart))
  }
}


const getBooks = (id) => {
  const cart = carts.find(cart => cart.id === id)

  if (cart) {
    return cart.books
  }
}



const addBooks = (book, id) => {
  const cart = carts.find(cart => cart.id === id)
  const data = carts
  cart.books.push(book)

  fs.writeFileSync("/workspaces/Backend-/server/data/carts.json", JSON.stringify(data))
  return cart.id
}


const deleteBook = (bookId, id) => {
  const cart = carts.find(cart => cart.id === id)
  const data = carts
  const newBooks = cart.books.filter(book => book.id !== bookId)
  cart.books = newBooks
  fs.writeFileSync("/workspaces/Backend-/server/data/carts.json", JSON.stringify(data))
}

module.exports = { createCart, deleteCart, getBooks, addBooks, deleteBook }
