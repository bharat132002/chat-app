const { User, FriendRequest } = require("../models");
const { Op } = require("sequelize");

// 🔍 SEARCH FRIENDS
exports.searchFriends = async (req, res) => {
    const q = req.query.q || "";

    try {
        const users = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${q}%`
                }
            },
            attributes: ["id", "username"]
        });

        return res.json({
            success: true,
            users
        });

    } catch (err) {
        return res.json({
            success: false,
            msg: err.message
        });
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
