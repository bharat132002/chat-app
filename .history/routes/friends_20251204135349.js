const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { searchUsers, sendRequest, getRequests, acceptRequest } = require("../controllers/friendsController");

router.get("/search", auth, searchUsers);
router.post("/request", auth,sendRequest);
router.get("/getrequests", auth, getRequests);
router.put("/accept/:id", auth, acceptRequest);


module.exports = router;