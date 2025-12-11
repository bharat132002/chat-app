const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const groupsController = require("../controllers/");
const auth = require("../middleware/auth");

router.post("/create", auth, upload.single("logo"), groupsController.createGroup);

module.exports = router;