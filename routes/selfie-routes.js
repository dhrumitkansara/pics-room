const express = require("express");
const router = express.Router();

// Import controller
const selfieController = require("../controllers/selfie-controller");

// Endpoints
router.get("/select-selfie", selfieController.select_selfie);
router.get("/filters", selfieController.filter);
router.get("/glasses", selfieController.glasses);
router.get("/virtual-background", selfieController.virtual_background);
router.get("/select-frame", selfieController.frame_select);
router.get("/frame", selfieController.selfie);
router.get("/group-selfie", selfieController.group_selfie);
router.get("/usie", selfieController.usie);
router.get("/:room", selfieController.room);

module.exports = router;
