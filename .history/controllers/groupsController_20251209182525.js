const { Group, GroupMember } = require("../models");

exports.createGroup = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const createdBy = req.user.id;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, msg: "Group name required" });
    }

    let photoPath = null;
    if (req.file) {
      photoPath = "/uploads/groups/" + req.file.filename;
    }

    // CREATE group
    const group = await Group.create({
      name,
      bio,
      photo: photoPath,
      createdBy,
    });

    // Creator = admin
    await GroupMember.create({
      groupId: group.id,
      userId: createdBy,
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      group,
    });
  } catch (err) {
    console.error("createGroup ERROR:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
