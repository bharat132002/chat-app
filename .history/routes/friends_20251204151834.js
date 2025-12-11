const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { searchUsers, sendRequest, getRequests, acceptRequest } = require("../controllers/friendsController");

router.get("/search", auth, searchUsers);
router.post("/send", auth,sendRequest);
router.get("/pending", auth, getRequests);
router.post("/accept/:requestId", auth, acceptRequest);


module.exports = router;