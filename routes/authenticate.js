const express = require("express");

const router = express.Router();

// register new users
router.post('/register', (req, res) => {
    res.send({ "message": "Just registered user" });
})

// let users login to the system
router.post('/login', (req, res) => {
    res.send({ "message": "Just logged user in" });
})

// let users logout of the system
router.post('/logout', (req, res) => {
    res.send({ "message": "Just logged user out" });
})

module.exports = router