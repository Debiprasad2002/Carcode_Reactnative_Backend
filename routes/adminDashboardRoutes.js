const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/adminDashboardController");

// Route to fetch the counts
router.get("/admin/counts", adminDashboardController.getCounts);

module.exports = router;
