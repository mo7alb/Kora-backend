const express = require("express");
const Player = require("../model/Player");
const Team = require("../model/Team");

const router = express.Router();

/**
 * route to return list of team players
 */
router.get("/team/:team", async (req, res) => {
   let team;
   try {
      team = await Team.findOne(req.params.team);
   } catch {
      res.status(404).json({ error: "team not found" });
   }

   let players;

   try {
      players = await Player.find({ team: team._id });
      res.json(players).status(200);
   } catch {
      res.status(500);
   }
});

/**
 * route to return player details
 */
router.get("/:id", async (req, res) => {
   let player;
   try {
      player = Player.findById(req.params.id);

      res.status(200).json(player);
   } catch {
      res.status(404);
   }
});

module.exports = router;
