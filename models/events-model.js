// Event model for admin
const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    name: String,
    date: Date,
    status: String,
    deleted: Boolean,
  },
  { timestamps: {} }
);

module.exports = mongoose.model("event", eventSchema);
