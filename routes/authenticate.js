// import packages
const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AuthMiddleware = require("../middleware/auth");

// register new users
router.post("/register", async (req, res) => {
   // check if not object is passed
   if (JSON.stringify({}) == JSON.stringify(req.body)) {
      return res.sendStatus(400).send({
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
      return res.sendStatus(400).send({
         error: "invalid data",
      });
   }
   const { name, username, email, password } = req.body;
   // check if username already exists
   const duplicatedUsernames = await User.find({ username: username });
   if (duplicatedUsernames.length !== 0) {
      return res.sendStatus(400);
   }

   // check if email address already exists
   const duplicatedEmails = await User.find({ email: email });
   if (duplicatedEmails.length !== 0) {
      return res.sendStatus(400).send("email already exists");
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

      res.status(201).send(user);
   } catch (error) {
      // adding user to db caused error
      console.error(error);
      res.status(500);
   }
});

// login user
router.post("/login", async (req, res) => {
   // check if not object is passed
   if (JSON.stringify({}) == JSON.stringify(req.body)) {
      return res.status(400);
   }
   // check if all properties are sent
   if (req.body.username == undefined || req.body.password == undefined) {
      return res.status(400);
   }

   try {
      const { username, password } = req.body;

      const user = await User.findOne({ username: username });
      if (user == undefined) {
         return res.status(400);
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

// change user password
router.post("/change-password", AuthMiddleware, async (req, res) => {
   // check if not object is passed
   if (JSON.stringify({}) == JSON.stringify(req.body)) {
      return res.status(400).send({
         error: "invalid data",
      });
   }
   // check if all properties are sent
   if (
      req.body.old_password == undefined ||
      req.body.new_password == undefined ||
      req.body.confirm_password == undefined
   ) {
      return res.status(400).send({
         error: "invalid data",
      });
   }

   let user;
   try {
      user = await User.findOne({ username: req.user.user });
   } catch {
      res.status(404).json({ error: "user not found" });
   }

   let old_password = req.body.old_password;
   let new_password = req.body.new_password;
   let confirm_password = req.body.confirm_password;

   // check if both passwords match
   if (new_password !== confirm_password)
      return res.status(400).json({ error: "Passwords do not match" });

   // check if old password is correct
   if (!(await bcrypt.compare(old_password, user.password))) {
      return res.status(400).json({ error: "Incorrect previous password" });
   }

   try {
      const hashedNewPassword = await bcrypt.hash(new_password, 10);
      await User.findOneAndUpdate(user._id, { password: hashedNewPassword });
      return res.sendStatus(200);
   } catch {
      res.status(500);
   }
});

module.exports = router;
