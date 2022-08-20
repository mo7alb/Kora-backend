const express = require("express");
const Team = require("../model/Team");
const User = require("../model/User");
const AuthMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * route to get a list of favorite teams
 */
router.get("/favorite-teams", AuthMiddleware, async (req, res) => {
   try {
      const user = await User.findOne({ username: req.user.user });

      let teams = await Team.find({ _id: { $in: user.favTeams } });

      res.status(200).json(teams);
   } catch (error) {
      res.sendStatus(500);
   }
});

/**
 * route to get a list of favorite teams
 */
router.post("/add-favorite-team", AuthMiddleware, async (req, res) => {
   if (req.body.team_id == undefined)
      return res.status(400).json({ error: "team id is required" });

   let teamId = req.body.team_id;
   try {
      let team = await Team.findById(teamId);
   } catch (error) {
      return res.sendStatus(404);
   }
   try {
      let user = await User.findOne({ username: req.user.user });

      if (user.favTeams.includes(teamId)) return res.sendStatus(400);

      await User.findByIdAndUpdate(user._id, {
         $push: {
            favTeams: [teamId],
         },
      });
      res.sendStatus(200);
   } catch (error) {
      res.status(500).json({ error: "unable to add team to favorites" });
   }
});

/**
 * route to get a list of favorite teams
 */
router.post("/remove-favorite-team", AuthMiddleware, async (req, res) => {
   if (req.body.team_id == undefined)
      return res.status(400).json({ error: "team id is required" });

   let teamId = req.body.team_id;
   let team;
   let user;
   try {
      team = await Team.findById(teamId);
   } catch (error) {
      return res.sendStatus(404).json({ error: "Team not found" });
   }

   try {
      user = await User.findOne({ username: req.user.user });
   } catch (error) {
      return res.sendStatus(404).json({ error: "User not found" });
   }

   if (!user.favTeams.includes(teamId)) return res.sendStatus(400);

   try {
      await User.findByIdAndUpdate(user._id, {
         $pullAll: {
            favTeams: [team._id],
         },
      });
      return res.sendStatus(200);
   } catch (error) {
      res.sendStatus(500);
   }
});

/**
 * Route to get a team
 * Requires a team id to be passed as a param
 */
router.get("/:id", async (req, res) => {
   if (req.params.id == "" || req.params.id == null) return res.status(400);

   try {
      const team = await Team.findById(req.params.id);

      if (team == null) {
         return res.status(404).json({ error: "team does not exists" });
      }

      res.status(200).json(team);
   } catch (error) {
      res.status(404).json({ error });
   }
});

module.exports = router;
