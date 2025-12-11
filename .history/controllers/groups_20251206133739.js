const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const { createGroup } = require("../controllers/groupsController");

// where images will store
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "uploads", "groups"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.random().toString(36).substring(2, 7) + ext);
  }
});

const upload = multer({ storage });

// CREATE GROUP
router.post(
  "/create",
  auth,
  upload.single("photo"),   // group photo
  createGroup
);

module.exports = router;
