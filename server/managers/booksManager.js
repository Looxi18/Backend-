const books = require ("../data/books.json");

const getAllBooks = ()=>{
  return books.length ? books : null
};

module.exports = {getAllBooks};

