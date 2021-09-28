// Event model for admin
const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: String,
  date: Date,
});

module.exports = mongoose.model("event", eventSchema);
