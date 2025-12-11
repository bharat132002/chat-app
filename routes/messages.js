const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getMessages, saveMessage } = require("../controllers/messagesController");

router.get("/:friendId", auth, getMessages);   // GET message history between req.user.id and friendId
router.post("/", auth, saveMessage);           // persist a message

module.exports = router;
