const express = require('express');
const router = express.Router();
const { getMessages, postMessage } = require('../controllers/chatController');

// Example routes
router.get('/', getMessages);
router.post('/', postMessage);

module.exports = router;  // <-- Ye hona bahut important
