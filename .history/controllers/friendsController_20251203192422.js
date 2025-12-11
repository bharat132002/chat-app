const { User ,FriendRequest } = require("../models");
const { Op } = require("sequelize");

exports.searchUsers = async (req, res) => {
    try {
        console.log(req.body);
        
        const query = req.query.username;
console.log(query);

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Please enter a username to search." });
        }

        const users = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ["id", "username", "email"]
        });

        res.json({ users , query });

    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ message: "Server error while searching users." });
    }
};


exports.sendRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        const exists = await FriendRequest.findOne({
            where: { senderId, receiverId }
        });

        if (exists) {
            return res.status(400).json({ message: "Request already sent" });
        }

        const request = await FriendRequest.create({
            senderId,
            receiverId
        });

        res.json({ message: "Request sent", request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await FriendRequest.findByPk(requestId);
        if (!request) return res.status(404).json({ message: "Not found" });

        request.status = "accepted";
        await request.save();

        res.json({ message: "Friend request accepted", request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await FriendRequest.findByPk(requestId);
        if (!request) return res.status(404).json({ message: "Not found" });

        request.status = "rejected";
        await request.save();

        res.json({ message: "Friend request rejected", request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

