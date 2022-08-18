// --- import DB ---
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONOGO_DB_CONNECTION_URI;
mongoose.connect(uri, () => console.log(`Connected to db`));

const League = require("../model/League");

async function createLeague(title, country) {
   console.log("creating a new league");

   try {
      const league = new League({
         title,
         country,
      });

      await league.save();

      return league;
   } catch (err) {
      console.error(err);
   }
}

const premierLeague = createLeague("Premier League", "England")
   .then(league => console.log(`Successfully added ${league.title} to the db`))
   .catch(err => console.error(err))
   .finally(() => process.exit(0));
