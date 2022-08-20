const express = require("express");
const Team = require("../model/Team");
const League = require("../model/League");

const router = express.Router();

/**
 * Route used to get list of leagues
 * Requires a league id passed as a param
 */
router.get("/", async (req, res) => {
   try {
      const leagues = await League.find();

      res.status(200).json(
         leagues.map(league => ({
            _id: league._id,
            title: league.title,
            country: league.country,
         }))
      );
   } catch (error) {
      console.error(error);
      res.status(500).json({ error });
   }
});

/**
 * Route used to get teams of a league
 * Requires a league id passed as a param
 */
router.get("/teams/:league", async (req, res) => {
   if (req.params.league == "" || req.params.league == null)
      return res.status(400);
   try {
      const league = await League.findById(req.params.league);
      if (league == null)
         return res.status(404).json({ error: "league doesn't exists" });

      const teams = await Team.find({
         leagues: { $elemMatch: { league: league._id } },
      });

      res.status(200).json(teams);
   } catch (error) {
      console.error(error);
      res.status(404).json({ error });
   }
});

module.exports = router;
