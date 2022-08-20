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
const matchesRoutes = require("./routes/matches");
const teamRoutes = require("./routes/team");

// use imported routes
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/leagues", require("./routes/league"));

const port = 3000;
app.listen(port, () => console.log(`app running on http://localhost:${port}`));
