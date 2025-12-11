const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { searchUsers } = require("../controllers/friendsController");

router.get("/search" searchUsers);

module.exports = router;