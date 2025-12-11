const { Group } = require("../models");

exports.createGroup = async (req, res) => {
  try {
    const { name, title, bio } = req.body;

    const group = await Group.create({
      name,
      title,
      bio,
      logo: req.file ? req.file.filename : null
    });

    res.json({
      success: true,
      msg: "Group created successfully",
      group
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, msg:"Server error" });
  }
};
