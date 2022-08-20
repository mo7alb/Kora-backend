// import packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// create an instance of an express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect to the mongoDB db from railway
const mongoDBURI = process.env.MONOGO_DB_CONNECTION_URI;
mongoose.connect(
   mongoDBURI,
   () => console.log("connected to db"),
   e => console.error(e)
);

// import routes
const authRoutes = require("./routes/authenticate");
const matchesRoute = require("./routes/matches");

// use imported routes
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchesRoute);

const port = 3000;
app.listen(port, () => console.log(`app running on http://localhost:${port}`));
