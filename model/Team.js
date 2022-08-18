const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   coach: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 120,
   },
   stadium: {
      type: String,
      required: true,
   },
   leagues: [mongoose.SchemaTypes.ObjectID],
});

module.exports = mongoose.model("Team", teamSchema);
