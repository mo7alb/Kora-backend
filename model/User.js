const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      immutable: true,
   },
   username: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
      dropDups: true,
   },
   email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      dropDups: true,
   },
   password: {
      type: String,
      required: true,
   },
   favLeagues: {
      type: [mongoose.SchemaTypes.ObjectId],
   },
   favTeams: {
      type: [mongoose.SchemaTypes.ObjectId],
   },
});

module.exports = mongoose.model("User", userSchema);
