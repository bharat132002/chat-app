const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { searchUsers } = require("../controllers/friendsController");

router.get("/search", auth, searchUsers);

module.exports = router;