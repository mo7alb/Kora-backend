// import packages and models
const mongoose = require("mongoose");
const Player = require("../model/Player");
const Team = require("../model/Team");
require("dotenv").config();
const fs = require("fs");
const parser = require("csv-parser");

// connect to db
const uri = process.env.MONOGO_DB_CONNECTION_URI;
mongoose.connect(uri, () => console.log(`Connected to db`));

function addPlayerToDB(fileName) {
   fs.createReadStream(fileName)
      .pipe(parser())
      .on("data", function (row) {
         (async () => {
            let keys = Object.keys(row);

            const player = new Player({
               name: row[keys[3]],
               shirtNumber: row[keys[0]],
               position: row[keys[1]],
               country: row[keys[2]],
               age: row[keys[4]],
            });

            await player.save();
            return player;
         })()
            .then(player =>
               console.log(`Successfully added ${player.name} to the db`)
            )
            .catch(err => console.error(err));
      });
}

filePaths = [
   `${__dirname}/man city players.csv`,
   `${__dirname}/liverpool players.csv`,
];

addPlayerToDB(filePaths[0]);
addPlayerToDB(filePaths[1]);

function addTeamReference(fileName, teamName) {
   if (teamName == "man city") {
      fs.createReadStream(fileName)
         .pipe(parser())
         .on("data", function (row) {
            (async () => {
               let keys = Object.keys(row);
               const team = await Team.findOne({
                  title: "Manchester City",
               });

               await Player.updateOne(
                  { name: row[keys[3]] },
                  { team: team._id }
               );
            })();
         });
   } else if (teamName == "liverpool") {
      fs.createReadStream(fileName)
         .pipe(parser())
         .on("data", function (row) {
            (async () => {
               let keys = Object.keys(row);
               const team = await Team.findOne({
                  title: "Liverpool",
               });

               await Player.updateOne(
                  { name: row[keys[3]] },
                  { team: team._id }
               );
            })();
         });
   }
}

addTeamReference(filePaths[0], "man city");
addTeamReference(filePaths[1], "liverpool");
