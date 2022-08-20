// import packages
const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

// register new users
router.post("/register", async (req, res) => {
   // check if not object is passed
   if (JSON.stringify({}) == JSON.stringify(req.body)) {
      return res.status(400).send({
         error: "invalid data",
      });
   }
   // check if all properties are sent
   if (
      req.body.name == undefined ||
      req.body.username == undefined ||
      req.body.email == undefined ||
      req.body.password == undefined
   ) {
      return res.status(400).send({
         error: "invalid data",
      });
   }
   const { name, username, email, password } = req.body;

   // check if username already exists
   const duplicatedUsernames = await User.find({ username: username });
   if (duplicatedUsernames.length !== 0) {
      console.log("duplicate usernames ===>", duplicatedUsernames);
      return res.status(400).send("username already exists");
   }

   // check if email address already exists
   const duplicatedEmails = await User.find({ email: email });
   if (duplicatedEmails.length !== 0) {
      return res.status(400).send("email already exists");
   }

   // add user to db
   try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
         name,
         username,
         email,
         password: hashedPassword,
      });

      user.save();

      res.status(201).send({ message: "Just registered user" });
   } catch (error) {
      // adding user to db caused error
      console.error(error);
      res.status(500);
   }
});

// let users login to the system
router.post("/login", async (req, res) => {
   // check if not object is passed
   if (JSON.stringify({}) == JSON.stringify(req.body)) {
      return res.status(400).send({
         error: "username or password are required",
      });
   }
   // check if all properties are sent
   if (req.body.username == undefined || req.body.password == undefined) {
      return res.status(400).send({
         error: "username or password are required",
      });
   }

   try {
      const { username, password } = req.body;

      const user = await User.findOne({ username: username });
      if (user == undefined) {
         return res.status(400).send({
            error: "invalid username",
         });
      }

      if (await bcrypt.compare(password, user.password)) {
         const token = jwt.sign(
            { user: user.username },
            process.env.SECRET_ACCESS_TOKEN
         );

         res.json({ token });
      } else {
         return res.status(400).send({
            error: "incorrect password",
         });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).send();
   }
});

module.exports = router;
