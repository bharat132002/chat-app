const { Group, GroupMember } = require("../models");

exports.createGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, title, bio } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, msg: "Group name required" });
    }

    let photoPath = null;
    if (req.file) {
      photoPath = "/uploads/groups/" + req.file.filename;
    }

    const group = await Group.create({
      name,
      title,
      bio,
      photo: photoPath
    });

    await GroupMember.create({
      groupId: group.id,
      userId: userId,
      role: "owner"
    });

    return res.json({ success: true, group });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
