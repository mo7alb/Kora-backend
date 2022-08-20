// import packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Team = require("./model/Team");
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

app.get("/", async (req, res) => {
   const team = await Team.findOne({ title: "Manchester City" });
   res.json(team);
});

// use imported routes
app.use("/api/auth", require("./routes/authenticate"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/teams", require("./routes/team"));
app.use("/api/leagues", require("./routes/league"));
app.use("/api/players", require("./routes/player"));
app.use("/api/", require("./routes/season"));

const port = 3000;
app.listen(port, () => console.log(`app running on http://localhost:${port}`));
