// Import statements
const framesData = require("../models/frames-model");

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
  // res.render("selfie");
  framesData
    .find((err, data) => {
      if (err) {
        console.log("Error fetching frames data: ", err);
        res.status(500).send(err); // Throwing error
      } else {
        console.log("Fetched frames data: ", data);
        res.render("selfie", { framesData: data }); // Rendering profile view and passing fetched profile data to the view
      }
    })
    .sort({ createdAt: -1 });
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
