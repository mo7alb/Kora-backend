const mongoose = require("mongoose");

const rowSchema = new mongoose.Schema({
    team: mongoose.SchemaTypes.ObjectID,
    gamesPlayed: {
      type: Number,
      required: true
    },
    goals: {
        type: Number,
        required: true
    },
    goalsConceded: {
        type: Number,
        required: true
    },
    won: {
        type: Number,
        required: true,
    },
    draw: {
        type: Number,
        required: true,
    },
    lost: {
        type: Number,
        required: true,
    },
    points: {
        type: Number,
        required: true
    }
});

const seasonSchema = new mongoose.Schema({
    season: {
        type: String,
        required: true,
        immutable: true
    },
    isCurrent: {
        type: Boolean,
        required: true,
        default: false
    },
    league: mongoose.SchemaTypes.ObjectID,
    table: {
        type: [rowSchema],
        required: true,
        minLength: 2
    },
});

module.exports = mongoose.model("Season", seasonSchema);