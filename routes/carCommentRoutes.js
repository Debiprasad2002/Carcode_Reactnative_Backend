const express = require('express');
const router = express.Router();
const carCommentController = require('../controllers/carCommentController');

// POST: Add a new comment
router.post('/car-comment/add', carCommentController.addComment);

// GET: Fetch comments by CID
router.post('/car-comment/fetch', carCommentController.getCommentsByCid);

module.exports = router;
