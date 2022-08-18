// --- import DB ---
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONOGO_DB_CONNECTION_URI;
// mongoose.connect(uri, () => console.log(`Connected to db`));

const Match = require("../model/Match");
const fs = require("fs");
const parser = require("csv-parser");

const path = `${__dirname}/data/2022-23 pm season.csv`;

function populate(fileName = path) {
   fs.createReadStream(fileName)
      .pipe(parser())
      .on("data", function (row) {
         let keys = Object.keys(row);
         console.log(keys);

			
      });
}

populate();
