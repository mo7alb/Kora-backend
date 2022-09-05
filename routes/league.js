const express = require("express");
const Team = require("../model/Team");
const League = require("../model/League");
const User = require("../model/User");

const AuthMiddleware = require("../middleware/auth");
const { compareSync } = require("bcrypt");

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

/**
 * route to get a list of favorite Leagues
 */
router.get("/favorite-leagues", AuthMiddleware, async (req, res) => {
   console.log("got request");
   console.log("req user", req.user);
   let requestUser = req.user.user;

   // try {
   // get user
   let user = await User.findOne({ username: requestUser });
   console.log(user);
   // } catch {
   //    res.sendStatus(404);
   // }

   try {
      let leagues = await League.find({ _id: { $in: user.favLeagues } });

      res.status(200).json(leagues);
   } catch (error) {
      res.sendStatus(500);
   }
});

/**
 * route to add a league to the favorite leagues
 */
router.post("/add-favorite-league", AuthMiddleware, async (req, res) => {
   if (req.body.league_id == undefined)
      return res.status(400).json({ error: "league id is required" });

   let leagueId = req.body.league_id;
   let league;

   try {
      league = await League.findById(leagueId);
   } catch (error) {
      return res.sendStatus(404).json({ error: "League not found" });
   }

   let user;
   try {
      user = await User.findOne({ username: req.user.user });
   } catch (error) {
      return res.sendStatus(404).json({ error: "user not found" });
   }
   try {
      if (user.favLeagues.includes(leagueId)) return res.sendStatus(400);

      await User.findByIdAndUpdate(user._id, {
         $push: {
            favLeagues: [league._id],
         },
      });
      res.sendStatus(200);
   } catch (error) {
      res.status(500).json({ error: "unable to add league to favorites" });
   }
});

/**
 * route to remove league from favorites
 */
router.post("/remove-favorite-league", AuthMiddleware, async (req, res) => {
   if (req.body.league_id == undefined)
      return res.status(400).json({ error: "league id is required" });

   let leagueId = req.body.league_id;
   let league;
   try {
      league = await League.findById(leagueId);
   } catch (error) {
      return res.sendStatus(404).json({ error: "League not found" });
   }

   let user;
   try {
      user = await User.findOne({ username: req.user.user });
   } catch (error) {
      return res.sendStatus(404).json({ error: "User not found" });
   }

   if (!user.favLeagues.includes(leagueId)) return res.sendStatus(400);

   try {
      await User.findByIdAndUpdate(user._id, {
         $pullAll: {
            favTeams: [league._id],
         },
      });
      console.log("Deleted league");
      return res.sendStatus(200);
   } catch (error) {
      res.sendStatus(500);
   }
});

module.exports = router;
