const fs = require("fs");
const path = require("path");
const { Group, GroupMember, User } = require("../models");

exports.createGroup = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const createdBy = req.user.id; // auth middleware must set req.user

    if (!name || name.trim() === "") {
      return res.status(400).json({ success:false, msg: "Group name required" });
    }

    // photo (if uploaded) is available at req.file (multer)
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/groups/${req.file.filename}`; // public path
    }

    const group = await Group.create({ name, bio, photo: photoPath, createdBy });

    // add creator as admin member
    await GroupMember.create({ groupId: group.id, userId: createdBy, role: "admin" });

    return res.status(201).json({ success:true, group });
  } catch (err) {
    console.error("createGroup err:", err);
    return res.status(500).json({ success:false, msg: "Server error" });
  }
};

exports.addMembers = async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const { userIds } = req.body; // expect array of user ids
    const requester = req.user.id;

    // optional: check if requester is admin of group
    const adminCheck = await GroupMember.findOne({ where: { groupId, userId: requester, role: "admin" }});
    if (!adminCheck) {
      return res.status(403).json({ success:false, msg: "Only group admin can add members" });
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success:false, msg: "userIds array required" });
    }

    const promises = userIds.map(uid => GroupMember.findOrCreate({
      where: { groupId, userId: uid },
      defaults: { role: "member" }
    }));
    await Promise.all(promises);

    return res.json({ success:true, msg: "Members added" });
  } catch (err) {
    console.error("addMembers err:", err);
    return res.status(500).json({ success:false, msg: "Server error" });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const id = Number(req.params.groupId);
    const group = await Group.findByPk(id, {
      include: [{ model: GroupMember, as: "members" }]
    });
    if (!group) return res.status(404).json({ success:false, msg: "Group not found" });
    return res.json({ success:true, group });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, msg: "Server error" });
  }
};
