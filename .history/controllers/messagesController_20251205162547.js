const { Message } = require("../models");
const { Op } = require("sequelize");

exports.getMessages = async (req, res) => {
  const userId = req.user.id;
  const friendId = Number(req.params.friendId);
  const msgs = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId }
      ]
    },
    order: [["createdAt", "ASC"]]
  });
  res.json({ success: true, messages: msgs });
};

exports.saveMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  try {
    const saved = await Message.create({ senderId, receiverId, message });
    res.json({ success: true, message: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, msg:"Server error" });
  }
};
