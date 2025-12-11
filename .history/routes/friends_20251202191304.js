const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    searchFriends,
    sendFriendRequest
} = require("../controllers/friendsController");

// SEARCH USERS
router.get("/search", auth, searchFriends);

// SEND FRIEND REQUEST
router.post("/send-request", auth, sendFriendRequest);

module.exports = router;
