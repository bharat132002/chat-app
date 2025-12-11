// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const auth = require("../middleware/authMiddleware");
// const { createGroup, addMembers, getMyGroups , editGroup, deleteGroup } = require("../controllers/groupsController");

// // Multer Storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../public/uploads/groups"));
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

// // ROUTES

// // Create Group
// router.post("/create", auth, upload.single("photo"), (req, res, next) => {
//   console.log("📢 HIT /api/groups/create");
//   console.log("BODY:", req.body);
//   console.log("FILE:", req.file);
//   next();
// }, createGroup);

// // Add Members
// router.post("/:groupId/members", auth, addMembers);

// // Get Group
// router.get("/my-groups", auth, getMyGroups);

// router.get("/test", (req, res) => {
//   res.json({ success: true, message: "Groups route working" });
// });

// // Edit Group
// router.put("/:groupId", auth, upload.single("photo"), editGroup);

// // Delete Group
// router.delete("/:groupId", auth, deleteGroup);

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const auth = require("../middleware/authMiddleware");
const {
  createGroup,
  addMembers,
  getMyGroups,
  editGroup,
  deleteGroup,
  getSingleGroup
} = require("../controllers/groupsController");

// MULTER STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/groups"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  }
});
const upload = multer({ storage });

// ROUTES
router.post("/create", auth, upload.single("photo"), createGroup);

router.get("/my-groups", auth, getMyGroups);

router.get("/:groupId", auth, getSingleGroup);

router.post("/:groupId/members", auth, addMembers);

router.put("/:groupId", auth, upload.single("photo"), editGroup);

router.delete("/:groupId", auth, deleteGroup);

module.exports = router;
