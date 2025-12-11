const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
    createGroup,
    getMyGroups,
    getGroup,
    updateGroup,
    addMember,
    removeMember,
    sendGroupMessage,
    getGroupMessages
} = require("../controllers/groupsController");

const upload = require("../middleware/uploadGroupImage");

// Create Group
router.post("/create", auth, upload.single("groupPhoto"), createGroup);

// All groups of logged in user
router.get("/my", auth, getMyGroups);

// Get single group details
router.get("/:groupId", auth, getGroup);

// Update group (name, bio, image)
router.put("/:groupId", auth, upload.single("groupPhoto"), updateGroup);

// Add member
router.post("/:groupId/add-member", auth, addMember);

// Remove member
router.post("/:groupId/remove-member", auth, removeMember);

// Group Messages
router.post("/:groupId/message", auth, sendGroupMessage);

router.get("/:groupId/messages", auth, getGroupMessages);

module.exports = router;
