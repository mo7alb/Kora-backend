const express = require("express");
const Match = require("../model/Match");
const User = require("../model/User");
const AuthMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
   const matches = await Match.find();

   res.status(200).json(matches);
});

router.get("/favorite", AuthMiddleware, async (req, res) => {
   let username = req.user.user;
   try {
      let user = await User.findOne({ username: username });

      if (user.favTeams == []) {
         return res.json([]);
      }

      let matches = [];
      // find home matches
      user.favTeams.forEach(async team => {
         matches = matches.concat(await Match.find({ "homeTeam.team": team }));
         matches = matches.concat(await Match.find({ "awayTeam.team": team }));
      });

      // find away matches

      res.status(200).json(matches);
   } catch (error) {
      res.status(500);
   }
});

router.get("/:id", async (req, res) => {
   try {
      const match = await Match.findById(req.params.id);

      res.json(match);
   } catch (error) {
      res.status(404);
   }
});

module.exports = router;
