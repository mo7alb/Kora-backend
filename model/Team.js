const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   coach: {
      type: String,
      minLength: 4,
      maxLength: 120,
   },
   stadium: {
      type: String,
   },
   leagues: [
      {
         league: mongoose.SchemaTypes.ObjectID,
      },
   ],
});

module.exports = mongoose.model("Team", teamSchema);
