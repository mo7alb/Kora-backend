const mongoose = require("mongoose");

const leagueSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   country: {
      type: String,
      required: true,
   },
   teams: [mongoose.SchemaTypes.ObjectID],
});

module.exports = mongoose.model("League", leagueSchema);
