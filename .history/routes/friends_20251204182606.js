const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { searchUsers, sendRequest, getRequests, acceptRequest ,rejectRequest, getMyFriends} = require("../controllers/friendsController");

router.get("/search", auth, searchUsers);
router.post("/send", auth,sendRequest);
router.get("/pending", auth, getRequests);
router.post("/accept/:requestId", auth, acceptRequest);
router.post("/reject/:requestId", auth, rejectRequest);
router.get("/all", auth, getMyFriends);


module.exports = router;