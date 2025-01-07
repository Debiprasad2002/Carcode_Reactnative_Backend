const express = require("express");
const router = express.Router();
const { getFullHPICheck } = require("../controllers/hpiCheckController");

// Define route for full HPI check
router.get("/full-check", getFullHPICheck);

module.exports = router;


