const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");
const { createGroup } = require("../controllers/groupsController");

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, ""));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({ storage });

// CREATE GROUP route
router.post("/create", auth, upload.single("photo"), createGroup);

module.exports = router;
