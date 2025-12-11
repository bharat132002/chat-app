const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../public/uploads/groups");

    // Create folder if not exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});
