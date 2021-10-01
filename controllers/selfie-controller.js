const { v4: uuidv4 } = require("uuid");

// Controller functions
exports.select_selfie = (req, res) => {
  res.render("selfie-options");
};

exports.filter = (req, res) => {
  res.render("filters");
};

exports.glasses = (req, res) => {
  res.render("glasses");
};

exports.virtual_background = (req, res) => {
  res.render("virtual-background");
};

exports.selfie = (req, res) => {
  res.render("selfie");
};

// Group selfie functions
exports.group_selfie = (req, res) => {
  res.render("group");
};

exports.usie = (req, res) => {
  res.redirect(`${uuidv4()}`); // Generates UUID on default route and redirects to /:room
};

exports.room = (req, res) => {
  res.render("room", { roomId: req.params.room });
};
