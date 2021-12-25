// Models import
const adminData = require("../models/user-model");
const captureData = require("../models/capture-model");
const eventsData = require("../models/events-model");
const framesData = require("../models/frames-model");

// Controller functions
exports.signin = (req, res) => {
  res.render("admin/admin-sign-in");
};

exports.dashboard = (req, res) => {
  eventsData
    .find((err, eventsData) => {
      if (err) {
        console.log("Error fetching events data: ", err);
        res.status(500).send(err); // Throwing error
      } else {
        console.log("Fetched events data: ", eventsData);
        captureData
          .find((err, capturedImageData) => {
            if (err) {
              console.log("Error fetching captured image data: ", err);
              res.status(500).send(err); // Throwing error
            }
            console.log("Fetched captured data: ", capturedImageData);
            res.render("admin/dashboard", {
              eventsData: eventsData,
              capturedImageData: capturedImageData,
            }); // Rendering dashboard view and passing fetched data to the view
          })
          .sort({ createdAt: -1 });
      }
    })
    .sort({ createdAt: -1 });
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
        eventsData.find((err, eventsData) => {
          if (err) {
            console.log("Error fetching events data: ", err);
            res.status(500).send(err); // Throwing error
          } else {
            console.log("Fetched events data: ", data);

            res.render("admin/customize", {
              framesData: data,
              eventsData: eventsData,
            }); // Rendering profile view and passing fetched profile data to the view
          }
        });
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
      res.redirect("events"); // Redirecting to events page once data is inserted to the DB
    }
  });
};

exports.add_frame = (req, res) => {
  let requestFrameData = req.body; // Extracting frame data from request body and assigning it to local variable
  eventsData.findOne({ name: requestFrameData.event }, (err, data) => {
    if (err) {
      console.log("Error fetching events data: ", err);
      res.status(500).send(err); // Throwing error
    } else {
      const framePostData = {
        frameUrl: requestFrameData.frameUrl,
        event: { _id: data._id, _ref: "events" },
        status: requestFrameData.status,
      };
      framesData.create(framePostData, (err, data) => {
        if (err) {
          console.log("Error saving frame data: ", err);
          res.status(500).send(err);
        } else {
          console.log("Frame data saved: ", requestFrameData);
          res.status(201).send(data);
        }
      });
    }
  });
};

exports.update_frame = (req, res) => {
  let requestFrameData = req.body; // Extracting frame data from request body and assigning it to local variable
  framesData.findOne({ frameUrl: requestFrameData.frameUrl }, (err, data) => {
    if (err) {
      console.log("Error fetching events data: ", err);
      res.status(500).send(err); // Throwing error
    } else {
      if (data.status === "inactive") {
        framesData.findByIdAndUpdate(
          { _id: data._id },
          { status: "active" },
          (err, responseData) => {
            if (err) {
              console.log("Error updating frame data: ", err);
              res.status(500).send(err);
            } else {
              console.log("Frame data updated: ", responseData);
              res.status(201).send(responseData);
            }
          }
        );
      } else {
        framesData.findByIdAndUpdate(
          { _id: data._id },
          { status: "inactive" },
          (err, responseData) => {
            if (err) {
              console.log("Error updating frame data: ", err);
              res.status(500).send(err);
            } else {
              console.log("Frame data updated: ", responseData);
              res.status(201).send(responseData);
            }
          }
        );
      }
    }
  });
};
