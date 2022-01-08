// Models import
const adminData = require("../models/user-model");
const captureData = require("../models/capture-model");
const eventsData = require("../models/events-model");
const framesData = require("../models/frames-model");
let session = require("express-session");
let bcrypt = require("bcrypt");

// Controller functions
exports.signin = (req, res) => {
  res.render("admin/admin-sign-in");
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  session = req.session;
  session.email = email;
  session.password = password;
  adminData.findOne({ email }, (err, data) => {
    if (data) {
      bcrypt.compare(password, data.password, (err, match) => {
        if (match) {
          session.isAuthenticated = true;
          res.redirect("/admin/dashboard");
        } else {
          // res.redirect("/admin/signin");
          res.status(401).send({ status: 401, message: "Invalid credentials" });
        }
      });
    }
  });
};

exports.logout = (req, res) => {
  if (req.session) req.session.destroy();
  res.redirect("/admin/signin");
};

exports.dashboard = (req, res) => {
  if (req.session.isAuthenticated) {
    eventsData
      .find({ deleted: false }, (err, eventsData) => {
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
  } else {
    res.redirect("/admin/signin");
  }
};

exports.profile = (req, res) => {
  if (req.session.isAuthenticated) {
    //   Fetching admin data
    adminData.find((err, data) => {
      if (err) {
        res.status(500).send(err); // Throwing error
      } else {
        res.render("admin/profile", { profileData: data }); // Rendering profile view and passing fetched profile data to the view
      }
    });
  } else {
    res.redirect("/admin/signin");
  }
};

exports.events = (req, res) => {
  if (req.session.isAuthenticated) {
    // Fetching events data
    eventsData
      .find({ deleted: false }, (err, data) => {
        if (err) {
          console.log("Error fetching events data: ", err);
          res.status(500).send(err); // Throwing error
        } else {
          console.log("Fetched events data: ", data);
          res.render("admin/events", { eventsData: data }); // Rendering profile view and passing fetched profile data to the view
        }
      })
      .sort({ createdAt: -1 });
  } else {
    res.redirect("/admin/signin");
  }
};

exports.loadEvents = (req, res) => {
  // Fetching events data
  eventsData
    .find({ deleted: false }, (err, data) => {
      if (err) {
        console.log("Error fetching events data: ", err);
        res.status(500).send(err); // Throwing error
      } else {
        console.log("Fetched load events data: ", data);
        res.status(200).send(data); // Sending events data
      }
    })
    .sort({ createdAt: -1 });
};

exports.activeEvent = (req, res) => {
  // Fetching events data
  eventsData
    .find({ status: "active" }, (err, data) => {
      if (err) {
        console.log("Error fetching events data: ", err);
        res.status(500).send(err); // Throwing error
      } else {
        console.log("Fetched active events data: ", data);
        data.map((eventData) => {
          res.status(200).send(eventData._id); // Sending active event's id
        });
      }
    })
    .sort({ createdAt: -1 });
};

exports.photos = (req, res) => {
  if (req.session.isAuthenticated) {
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
  } else {
    res.redirect("/admin/signin");
  }
};

exports.get_photos = (req, res) => {
  // Fetching captured images data for photos

  let requestPhotoData = req.body;
  captureData.findById(
    { _id: requestPhotoData },
    (requestPhotoData,
    (err, data) => {
      if (err) {
        res.status(500).send(err); // Throwing error
      } else {
        res.status(200).send(data); // Sending photos data
      }
    })
  );
};

exports.customize = (req, res) => {
  if (req.session.isAuthenticated) {
    framesData
      .find({ status: "active" }, (err, data) => {
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
  } else {
    res.redirect("/admin/signin");
  }
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

exports.update_event = (req, res) => {
  let requestEventData = req.body;

  // Updating event status based on id
  eventsData.findByIdAndUpdate(
    { _id: requestEventData.id },
    { status: requestEventData.status },
    (requestEventData,
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data); // Sending updated event data
      }
    })
  );
};

exports.delete_event = (req, res) => {
  let requestEventData = req.body;

  // Updating event status based on id
  eventsData.findByIdAndUpdate(
    { _id: requestEventData.id },
    { deleted: requestEventData.deleted, status: "inactive" },
    (requestEventData,
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data); // Sending updated event data
      }
    })
  );
};
