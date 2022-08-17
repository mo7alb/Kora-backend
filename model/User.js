const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        immutable: true,
        minLength: 4,
        maxLength: 120,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 5,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    favLeagues: {
        type: [mongoose.SchemaTypes.ObjectId]
    },
    favTeams: {
        type: [mongoose.SchemaTypes.ObjectId]
    }
})

module.exports = mongoose.model("User", userSchema);