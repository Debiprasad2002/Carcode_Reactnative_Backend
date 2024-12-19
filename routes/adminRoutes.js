const express = require("express");
const { getUsers } = require("../controllers/adminController");

const router = express.Router();

// GET all users
router.get("/users", getUsers);

module.exports = router;
