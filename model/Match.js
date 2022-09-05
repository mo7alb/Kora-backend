const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
   homeTeam: {
      team: mongoose.SchemaTypes.ObjectID,
      score: Number,
   },
   awayTeam: {
      team: mongoose.SchemaTypes.ObjectID,
      score: Number,
   },
   venue: {
      type: String,
      required: true,
   },
   date: {
      type: Date,
   },
   league: {
      type: mongoose.SchemaTypes.ObjectID,
      required: true,
   },
});

module.exports = mongoose.model("Match", matchSchema);
