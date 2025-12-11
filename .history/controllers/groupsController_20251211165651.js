const fs = require("fs");
const path = require("path");
const { User, Group, GroupMember } = require("../models");

// CREATE GROUP
exports.createGroup = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const createdBy = req.user.id;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, msg: "Group name required" });
    }

    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/groups/${req.file.filename}`;
    }

    const group = await Group.create({ name, bio, photo: photoPath, createdBy });

    await GroupMember.create({
      groupId: group.id,
      userId: createdBy,
      role: "admin"
    });

    return res.status(201).json({ success: true, group });

  } catch (err) {
    console.error("createGroup error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ADD MEMBERS
exports.addMembers = async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const { userIds } = req.body;
    const adminId = req.user.id;

    const isAdmin = await GroupMember.findOne({
      where: { groupId, userId: adminId, role: "admin" }
    });

    if (!isAdmin) {
      return res.status(403).json({ success: false, msg: "Only admin can add members" });
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, msg: "userIds array required" });
    }

    for (let id of userIds) {
      await GroupMember.findOrCreate({
        where: { groupId, userId: id },
        defaults: { role: "member" }
      });
    }

    return res.json({ success: true, msg: "Members added" });

  } catch (err) {
    console.error("addMembers error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

// GET MY GROUPS
exports.getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.findAll({
      where: { createdBy: userId },
      include: [{ model: GroupMember, as: "members" }]
    });

    return res.json({ success: true, groups });

  } catch (err) {
    console.error("getMyGroups error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

// GET SINGLE GROUP
exports.getSingleGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: GroupMember,
          as: "members",
          include: [{ model: User, attributes: ["id", "username"] }]
        }
      ]
    });

    if (!group) {
      return res.json({ success: false, msg: "Group not found" });
    }

    return res.json({ success: true, group });

  } catch (err) {
    console.error("getSingleGroup error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

// EDIT GROUP
exports.editGroup = async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const userId = req.user.id;
    const { name, bio } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ success: false, msg: "Group not found" });

    const admin = await GroupMember.findOne({
      where: { groupId, userId, role: "admin" }
    });

    if (!admin) {
      return res.status(403).json({ success: false, msg: "Only admin can edit" });
    }

    if (req.file) {
      if (group.photo) {
        const oldPath = path.join(__dirname, "../public", group.photo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      group.photo = `/uploads/groups/${req.file.filename}`;
    }

    if (name) group.name = name;
    if (bio) group.bio = bio;

    await group.save();

    return res.json({ success: true, group });

  } catch (err) {
    console.error("editGroup error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

// DELETE
exports.deleteGroup = async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const userId = req.user.id;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ success: false, msg: "Group not found" });

    const admin = await GroupMember.findOne({
      where: { groupId, userId, role: "admin" }
    });

    if (!admin) {
      return res.status(403).json({ success: false, msg: "Only admin can delete" });
    }

    if (group.photo) {
      const oldPath = path.join(__dirname, "../public", group.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await GroupMember.destroy({ where: { groupId } });
    await group.destroy();

    return res.json({ success: true, msg: "Group deleted" });

  } catch (err) {
    console.error("deleteGroup error:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
