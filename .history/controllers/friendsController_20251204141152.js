const { User, FriendRequest } = require("../models");
const { Op } = require("sequelize");

exports.searchUsers = async (req, res) => {
  try {
    console.log(req.body);

    const query = req.query.username;
    console.log(query);

    if (!query || query.trim() === "") {
      return res
        .status(400)
        .json({ message: "Please enter a username to search." });
    }

    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`,
        },
      },
      attributes: ["id", "username", "email"],
    });

    res.json({ users, query });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error while searching users." });
  }
};

/* ---------------- SEND REQUEST ---------------- */
exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id; // token se aa raha hai
    const receiverId = req.body.receiverId;

    if (!receiverId) {
      return res
        .status(400)
        .json({ success: false, msg: "receiverId required" });
    }

    if (senderId == receiverId) {
      return res
        .status(400)
        .json({ success: false, msg: "You cannot send request to yourself" });
    }

    // Check receiver exists
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check already sent?
    const already = await FriendRequest.findOne({
      where: { senderId, receiverId },
    });
    if (already) {
      return res
        .status(400)
        .json({ success: false, msg: "Request already sent" });
    }
    // Save request
    await FriendRequest.create({
      senderId,
      receiverId,
      status: "pending",
    });
    return res.status(201).json({
      success: true,
      msg: "Friend request sent successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
/* ---------------- GET PENDING REQUESTS ---------------- */
exports.getRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.findAll({
      where: {
        receiverId: req.user.id,
        status: "pending",
      },
      include: [{ model: User, as: "Sender", attributes: ["id", "username"] }],
    });

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch requests" });
  }
};

/* ---------------- ACCEPT REQUEST ---------------- */
exports.acceptRequest = async (req, res) => {
  try {
    const r = await FriendRequest.findOne({
      where: { id: req.params.id, receiverId: req.user.id },
    });

    if (!r) return res.status(400).json({ message: "Request not found" });

    r.status = "accepted";
    await r.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting request" });
  }
};
