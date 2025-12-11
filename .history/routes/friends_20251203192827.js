const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { searchUsers,sendRequest } = require("../controllers/friendsController");

router.get("/search", auth, searchUsers);
router.post("/request/:id", auth, friendController.sendRequest);
router.get("/requests", auth, friendController.getRequests);
router.put("/accept/:id", auth, friendController.acceptRequest);


module.exports = router;