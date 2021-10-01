// Frames model
const mongoose = require("mongoose");

// Defining schema for captured collection
const frameSchema = mongoose.Schema(
  {
    frameUrl: String,
  },
  { timestamps: {} }
);

module.exports = mongoose.model("frame", frameSchema); // Exporting model with collection name frame
