const express = require("express");
const router = express.Router();

// Import controller
const adminController = require("../controllers/admin-controller");

// GET Endpoints
router.get("/signin", adminController.signin);
router.get("/dashboard", adminController.dashboard);
router.get("/profile", adminController.profile);
router.get("/events", adminController.events);
router.get("/load-events", adminController.loadEvents);
router.get("/get-active-event", adminController.activeEvent);
router.get("/photos", adminController.photos);
router.get("/customize", adminController.customize);

// POST Endpoint
router.post("/signin", adminController.login);
router.post("/events", adminController.create_event);
router.post("/add-frame", adminController.add_frame);
router.post("/update-frame", adminController.update_frame);
router.post("/update-event", adminController.update_event);
router.post("/delete-event", adminController.delete_event);
router.post("/get-photos", adminController.get_photos);
router.get("/signout", adminController.logout);

module.exports = router;
