// Models import
const adminData = require("../models/userModel");
const captureData = require("../models/captureModel");
const eventsData = require("../models/eventsModel");
const framesData = require("../models/framesModel");

// Controller functions
exports.signin = (req, res) => {
  res.render("admin/adminSignin");
};

exports.dashboard = (req, res) => {
  eventsData.find((err, eventsData) => {
    if (err) {
      console.log("Error fetching events data: ", err);
      res.status(500).send(err); // Throwing error
    } else {
      console.log("Fetched events data: ", eventsData);
      captureData.find((err, capturedImageData) => {
        if (err) {
          console.log("Error fetching captured image data: ", err);
          res.status(500).send(err); // Throwing error
        }
        console.log("Fetched captured data: ", capturedImageData);
        res.render("admin/dashboard", {
          eventsData: eventsData,
          capturedImageData: capturedImageData,
        }); // Rendering dashboard view and passing fetched data to the view
      });
    }
  });
};

exports.profile = (req, res) => {
  //   Fetching admin data
  adminData.find((err, data) => {
    if (err) {
      res.status(500).send(err); // Throwing error
    } else {
      res.render("admin/profile", { profileData: data }); // Rendering profile view and passing fetched profile data to the view
    }
  });
};

exports.events = (req, res) => {
  // Fetching events data
  eventsData
    .find((err, data) => {
      if (err) {
        console.log("Error fetching events data: ", err);
        res.status(500).send(err); // Throwing error
      } else {
        console.log("Fetched events data: ", data);
        res.render("admin/events", { eventsData: data }); // Rendering profile view and passing fetched profile data to the view
      }
    })
    .sort({ createdAt: -1 });
};

exports.photos = (req, res) => {
  // Fetching captured images data for photos page
  captureData
    .find((err, data) => {
      if (err) {
        res.status(500).send(err); // Throwing error
      } else {
        res.render("admin/photos", { capturedImageData: data }); // Rendering photos view and passing fetched photos data to the view
      }
    })
    .sort({ createdAt: -1 });
};

exports.customize = (req, res) => {
  framesData
    .find((err, data) => {
      if (err) {
        console.log("Error fetching frames data: ", err);
        res.status(500).send(err); // Throwing error
      } else {
        console.log("Fetched frames data: ", data);
        res.render("admin/customize", { framesData: data }); // Rendering profile view and passing fetched profile data to the view
      }
    })
    .sort({ createdAt: -1 });
};

exports.create_event = (req, res) => {
  let requestEventData = req.body; // Extracting event data from request body and assigning it to local variable

  // Creating data in events collection
  eventsData.create(requestEventData, (err, data) => {
    if (err) {
      console.log("Error saving events data: ", err);
      res.status(500).send(err);
    } else {
      console.log("Events data saved: ", requestEventData);
      res.redirect("/events"); // Redirecting to events page once data is inserted to the DB
    }
  });
};

exports.add_frame = (req, res) => {
  let requestFrameData = req.body; // Extracting frame data from request body and assigning it to local variable
  framesData.create(requestFrameData, (err, data) => {
    if (err) {
      console.log("Error saving frame data: ", err);
      res.status(500).send(err);
    } else {
      console.log("Frame data saved: ", requestFrameData);
      res.status(201).send(data);
    }
  });
};
