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

function addTeamsToDB(fileName = "teams.csv") {
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
      const team = await Team.updateOne(
         { title: name },
         { leagues: [premierLeague._id] }
      );
   }

   // add all teams to preimer league
   let teamIds = [];
   for (let j = 0; j < teamsList.length; j++) {
      let name = teamsList[j];

      let team = await Team.findOne({ title: name });
      teamIds.push(team._id);
   }

   if (teamIds !== [])
      await League.updateOne({ title: "Premier League" }, { teams: teamIds });
}

addTeamsToDB();
addLeagueToTeams()
   .then(() =>
      console.log("added league to all teams and added all teams to the league")
   )
   .catch(err => console.error(error))
   .finally(() => process.exit(0));
