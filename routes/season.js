const express = require("express");
const Season = require("../model/Season");
const League = require("../model/League");

const router = express.Router();

/**
 * a list of seasons for a league
 */
router.get("/seasons/:league", async (req, res) => {
   let league;
   try {
      league = await League.findById(req.params.league);
   } catch {
      res.sendStatus(404).json({ error: "League not found " });
   }

   try {
      let seasons = await Season.find({ league: league._id });

      res.status(200).json(seasons);
   } catch {
      res.status(400);
   }
});

/**
 * get season by id
 */
router.get("/season/:season", async (req, res) => {
   try {
      let season = await Season.findById(req.params.season);

      res.status(200).json(season);
   } catch {
      res.status(404).json({ error: "season not found" });
   }
});

module.exports = router;
