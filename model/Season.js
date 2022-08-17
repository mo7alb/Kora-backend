const mongoose = require("mongoose");

const rowSchema = new mongoose.Schema({
    team: mongoose.SchemaTypes.ObjectID,
    goals: {
        type: Number,
        required: true
    },
    goalsConceded: {
        type: Number,
        required: true
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
    league: {
        type: mongoose.SchemaType.ObjectID,
        required: true,
    },
    table: {
        type: [rowSchema],
        required: true,
        minLength: 2
    },
    topScorers: [{
        player: mongoose.SchemaTypes.ObjectID,
        goals: { type: Number, required: true },
    }]
});

module.exports = mongoose.model("Season", seasonSchema);