const express = require("express");
const router = express.Router();

// Import controller
const selfieController = require("../controllers/selfie");

// Endpoints
router.get("/select-selfie", selfieController.select_selfie);
router.get("/filters", selfieController.filter);
router.get("/glasses", selfieController.glasses);
router.get("/virtual-background", selfieController.virtual_background);
router.get("/frame", selfieController.selfie);

module.exports = router;
