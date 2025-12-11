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
    const senderId = req.user.id; // token se aayega
    const receiverId = req.body.receiverId;

    if (!receiverId) {
      return res.status(400).json({ success: false, msg: "receiverId required" });
    }

    if (senderId == receiverId) {
      return res.status(400).json({ success: false, msg: "You cannot send request to yourself" });
    }

    // Check receiver exists
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check if a request already exists (pending or accepted)
    const existingRequest = await FriendRequest.findOne({
      where: {
        senderId,
        receiverId
      }
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ success: false, msg: "Request already sent" });
      } else if (existingRequest.status === "accepted") {
        return res.status(400).json({ success: false, msg: "You are already friends" });
      } else if (existingRequest.status === "rejected") {
        // If previously rejected, allow sending again
        existingRequest.status = "pending";
        await existingRequest.save();
        return res.status(201).json({ success: true, msg: "Friend request sent again" });
      }
    }

    // Create new request
    await FriendRequest.create({
      senderId,
      receiverId,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      msg: "Friend request sent successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
/* ---------------- GET PENDING REQUESTS ---------------- */
exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id; // token se aa raha hai

    // Fetch all pending requests where logged-in user is the receiver
    const requests = await FriendRequest.findAll({
      where: { receiverId: userId, status: "pending" },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "username", "email"]
        }
      ]
    });

    return res.json({
      success: true,
      requests
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
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
