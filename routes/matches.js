const express = require("express");
const Match = require("../model/Match");
const User = require("../model/User");
const Team = require("../model/Team");
const League = require("../model/League");
const AuthMiddleware = require("../middleware/auth");

const router = express.Router();

/***
 * route to return all matches of a league
 */
router.get("/league/:league", async (req, res) => {
   let league;
   try {
      league = await League.findById(req.params.league);
   } catch {
      res.status(404).json({ error: "league not found" });
   }

   let matches;
   try {
      matches = await Match.find({ league: league._id });

      res.status(200).json(matches);
   } catch {
      res.status(500);
   }
});

/**
 * route to return list of matches played by a favorite team
 */
router.get("/favorite", AuthMiddleware, async (req, res) => {
   let username = req.user.user;
   try {
      let user = await User.findOne({ username: username });

      if (user.favTeams == []) {
         return res.json([]);
      }
      let teams = user.favTeams;
      let matches = [];
      for (let i = 0; i < teams.length; i++) {
         let matchList = await Match.find({
            $or: [{ "homeTeam.team": teams[i] }, { "awayTeam.team": teams[i] }],
         });
         matches = matches.concat(matchList);
      }

      res.status(200).json(matches);
   } catch (error) {
      res.status(500);
   }
});

/**
 * route to return details of a single match
 */
router.get("/:id", async (req, res) => {
   try {
      const match = await Match.findById(req.params.id);

      res.json(match);
   } catch (error) {
      res.status(404);
   }
});

module.exports = router;
