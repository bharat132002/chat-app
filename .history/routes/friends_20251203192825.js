const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { searchUsers,sendRequest } = require("../controllers/friendsController");

router.get("/search", auth, searchUsers);

module.exports = router;