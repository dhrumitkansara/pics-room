const express = require("express");
const router = express.Router();

// Import controller
const adminController = require("../controllers/admin-controller");

// GET Endpoints
router.get("/signin", adminController.signin);
router.get("/dashboard", adminController.dashboard);
router.get("/profile", adminController.profile);
router.get("/events", adminController.events);
router.get("/photos", adminController.photos);
router.get("/customize", adminController.customize);

// POST Endpoint
router.post("/events", adminController.create_event);
router.post("/add-frame", adminController.add_frame);

module.exports = router;
