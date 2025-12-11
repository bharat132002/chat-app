const { User, FriendRequest } = require("../models");
const { Op } = require("sequelize");

// 🔍 SEARCH FRIENDS
exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.username;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Enter username to search" });
        }

        const users = await User.findAll({
            where: {
                username: {
                    [require('sequelize').Op.like]: `%${query}%`
                }
            },
            attributes: ["id", "username", "email"]
        });

        res.json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
// ➕ SEND FRIEND REQUEST
exports.sendFriendRequest = async (req, res) => {
    const fromUser = req.user.id;
    const { toUser } = req.body;

    try {
        if (fromUser === toUser) {
            return res.json({
                success: false,
                msg: "You cannot send request to yourself."
            });
        }

        const exists = await FriendRequest.findOne({
            where: { fromUser, toUser }
        });

        if (exists) {
            return res.json({
                success: false,
                msg: "Request already sent."
            });
        }

        await FriendRequest.create({
            fromUser,
            toUser,
            status: "pending"
        });

        return res.json({
            success: true,
            msg: "Friend request sent!"
        });

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
    }
};
