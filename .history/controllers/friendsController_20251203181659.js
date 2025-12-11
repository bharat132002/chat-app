const { User } = require("../models");
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
        const fromUserId = req.user.id;
        const toUserId = req.params.id;

        await FriendRequest.create({
            fromUserId,
            toUserId,
            status: "pending"
        });

        res.json({ message: "Friend request sent!" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error sending request" });
    }
};

