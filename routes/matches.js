const express = require("express");
const Match = require("../model/Match");
const User = require("../model/User");
const League = require("../model/League");
const AuthMiddleware = require("../middleware/auth");

const router = express.Router();

/***
 * route to return all matches of a league
 */
router.get("/league/:league", async (req, res) => {
   const date = new Date();
   const day = date.getDate();
   const month = date.getMonth();
   const year = date.getFullYear();
   const startDate = new Date(year, month, day - 1);
   const endDate = new Date(year, month + 1, 0);

   let league;
   try {
      league = await League.findById(req.params.league);
   } catch {
      res.status(404).json({ error: "league not found" });
   }

   let matches;
   try {
      matches = await Match.find({
         league: league._id,
         date: {
            $gte: startDate,
            $lt: endDate,
         },
      });

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
