const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        immutable: true,
        minLength: 4,
        maxLength: 120,
    },
    age: {
        type: Number,
        min: 10,
        max: 100,
        required: true
    },
    weight: {
        type: Number,
        min: 10,
        max: 160,
        required: true
    },
    team: {
        type: mongoose.SchemaTypes.ObjectID,
    },
    country: {
        type: String,
        required: true,
        immutable: true,
        minLength: 4,
        maxLength: 120,
    },
    position: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Player", playerSchema);