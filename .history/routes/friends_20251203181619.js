const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { searchUsers } = require("../controllers/friendsController");

router.post('/request/:id', auth, sendRequest);
router.get("/search", auth, searchUsers);

module.exports = router;