// --- import DB ---
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONOGO_DB_CONNECTION_URI;
mongoose.connect(uri, () => console.log(`Connected to db`));

const Match = require("../model/Match");
const Team = require("../model/Team");
const League = require("../model/League");
const fs = require("fs");
const parser = require("csv-parser");

const path = `${__dirname}/data/2022-23 pm season.csv`;

function populate(fileName = path) {
   fs.createReadStream(fileName)
      .pipe(parser())
      .on("data", async function (row) {
         let keys = Object.keys(row);

         const league = await League.findOne({ title: "Premier League" });
         const homeTeam = await Team.findOne({ title: row[keys[2]] });
         const awayTeam = await Team.findOne({ title: row[keys[4]] });

         if (row[keys[3]] !== "-") {
            // have a result
            const match = new Match({
               homeTeam: {
                  team: homeTeam._id,
                  score: parseInt(row[keys[3]]),
               },
               awayTeam: {
                  team: awayTeam._id,
                  score: parseInt(row[keys[5]]),
               },
               venue: row[keys[1]],
               date: new Date(row[keys[0]]),
               league: league._id,
            });

            await match.save();
         } else {
            // don't have a result
            const match = new Match({
               homeTeam: {
                  team: homeTeam._id,
               },
               awayTeam: {
                  team: awayTeam._id,
               },
               venue: row[keys[1]],
               date: new Date(row[keys[0]]),
               league: league._id,
            });

            await match.save();
         }
      });
}

populate();
