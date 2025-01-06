const express = require("express");
const router = express.Router();
const motHistoryController = require("../controllers/motHistoryController");

// Define route to fetch MOT history
router.get("/mot/history", motHistoryController.getMOTHistory);

module.exports = router;
