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
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }

    const already = await FriendRequest.findOne({
      where: { senderId, receiverId }
    });

    if (already) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const newReq = await FriendRequest.create({
      senderId,
      receiverId,
      status: "pending"
    });

    res.json({ message: "Friend request sent", request: newReq });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
