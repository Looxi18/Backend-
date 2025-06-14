const express = require("express");
const router = express.Router();
const books = require("./book.route");
const cart = require("./cart.route");
const sessions = require('./sessions.route');
const users = require('./users.route');


router.use('/api/users', users);
router.use("/api/sessions", sessions);
router.use("/api/books", books)
router.use("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts")
})

router.use("/home", books)
router.use("/api/cart", cart)




module.exports = router;