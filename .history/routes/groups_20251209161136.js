const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");
const { createGroup, addMembers, getGroup } = require("../controllers/groupsController");

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../public/uploads/groups");
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random()*1e9) + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// create group (multipart/form-data)
router.post("/create", auth, upload.single("photo"), createGroup);

// add members
router.post("/:groupId/members", auth, addMembers);

// get group
router.get("/:groupId", auth, getGroup);

module.exports = router;
