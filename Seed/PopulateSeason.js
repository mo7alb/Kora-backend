// --- import DB ---
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONOGO_DB_CONNECTION_URI;
mongoose.connect(uri, async () => {
   console.log("--- connected to db ---");
   console.log("--- creating seasons ---");
   // query league
   const league = await League.findOne({ title: "Premier League" });
   // create a season
   let prevSeason = new Season({
      season: "2021-22",
      league: league._id,
   });

   await prevSeason.save();

   let newSeason = new Season({
      season: "2022-23",
      isCurrent: true,
      league: league._id,
   });
   await newSeason.save();
});

const Season = require("../model/Season");
const League = require("../model/League");
const Team = require("../model/Team");
const fs = require("fs");
const parser = require("csv-parser");

const previousPath = `${__dirname}/data/2021-22 season.csv`;

function readFromFile(fileName = previousPath) {
   fs.createReadStream(fileName)
      .pipe(parser())
      .on("data", function (row) {
         let keys = Object.keys(row);
         (async () => {
            let team = await Team.findOne({ title: row[keys[0]] });
            if (team == null) {
               team = new Team({
                  title: row[keys[0]],
               });

               await team.save();
            }

            const season = await Season.findOne({ season: "2021-22" });

            await Season.findByIdAndUpdate(season._id, {
               $push: {
                  table: {
                     team: team._id,
                     played: parseInt(row[keys[1]]),
                     won: parseInt(row[keys[2]]),
                     draw: parseInt(row[keys[3]]),
                     lost: parseInt(row[keys[4]]),
                     goals: parseInt(row[keys[5]]),
                     goalsConceded: parseInt(row[keys[6]]),
                     points: parseInt(row[keys[7]]),
                  },
               },
            });
         })();
      });
}

readFromFile();
