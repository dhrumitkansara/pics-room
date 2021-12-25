// Capture image url model
const mongoose = require("mongoose");

// Defining schema for captured collection
const captureImageSchema = mongoose.Schema(
  {
    imageUrl: String,
    event: Object,
  },
  { timestamps: {} }
);

module.exports = mongoose.model("captured", captureImageSchema); // Exporting model with collection name captured
