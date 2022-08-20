// import required items
const Team = require("../model/Team");
const League = require("../model/League");
const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs");
const parser = require("csv-parser");

const teamsList = [
   "Arsenal",
   "Aston Villa",
   "Bournemouth",
   "Brentford",
   "Brighton & Hove Albion",
   "Chelsea",
   "Crystal Palace",
   "Everton",
   "Fulham",
   "Leeds United",
   "Leicester City",
   "Liverpool",
   "Manchester City",
   "Manchester United",
   "Newcastle United",
   "Nottingham Forest",
   "Southampton",
   "Tottenham Hotspur",
   "West Ham United",
   "Wolverhampton Wanderers",
];

// --- conncet to DB ---
const uri = process.env.MONOGO_DB_CONNECTION_URI;
mongoose.connect(uri, () => console.log(`Connected to db`));

function addTeamsToDB(fileName = "data/teams.csv") {
   let fullPath = `${__dirname}/${fileName}`;

   fs.createReadStream(fullPath)
      .pipe(parser())
      .on("data", function (row) {
         (async () => {
            let keys = Object.keys(row);

            const team = new Team({
               title: row[keys[0]],
               stadium: row[keys[1]],
               coach: row[keys[2]],
            });

            await team.save();
            return team;
         })()
            .then(team =>
               console.log(`Successfully added ${team.title} to the db`)
            )
            .catch(err => console.error(err));
      });
}

async function addLeagueToTeams() {
   const premierLeague = await League.findOne({ title: "Premier League" });

   // add premier league to all teams
   for (let i = 0; i < teamsList.length; i++) {
      let name = teamsList[i];
      // get team instance from db
      const team = await Team.findOne({ title: name });

      // update team
      await Team.findByIdAndUpdate(team._id, {
         $push: { leagues: { league: premierLeague._id } },
      });

      // update league
      await League.findByIdAndUpdate(premierLeague._id, {
         $push: { teams: team._id },
      });
   }
}

addTeamsToDB();
addLeagueToTeams()
   .then(() =>
      console.log("added league to all teams and added all teams to the league")
   )
   .catch(err => console.error(err))
   .finally(() => process.exit(0));
