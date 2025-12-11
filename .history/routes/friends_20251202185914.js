const express = require("express");
const router = express.Router();
const { User, Friend, FriendRequest } = require("../models");
const auth = require("../middleware/authMiddleware");


// SEARCH USER
router.get("/search/:username", auth, async (req, res) => {
    const username = req.params.username;

    const users = await User.findAll({
        where: {
            username: username
        }
    });

    res.json({ success: true, users });
});


// SEND FRIEND REQUEST
router.post("/request", auth, async (req, res) => {
    const { receiver_id } = req.body;

    await FriendRequest.create({
        sender_id: req.user.id,
        receiver_id,
        status: "pending"
    });

    res.json({ success: true, message: "Friend request sent!" });
});


// GET PENDING REQUESTS
router.get("/requests", auth, async (req, res) => {
    const requests = await FriendRequest.findAll({
        where: { receiver_id: req.user.id, status: "pending" },
        include: [{ model: User, as: "sender", attributes: ["id", "username"] }]
    });

    res.json({ success: true, requests });
});


// ACCEPT REQUEST
router.post("/accept", auth, async (req, res) => {
    const { request_id, sender_id } = req.body;

    // request update
    await FriendRequest.update(
        { status: "accepted" },
        { where: { id: request_id } }
    );

    // add to friends table
    await Friend.create({ user_id: req.user.id, friend_id: sender_id });
    await Friend.create({ user_id: sender_id, friend_id: req.user.id });

    res.json({ success: true, message: "Friend added!" });
});


// GET MY FRIENDS
router.get("/list", auth, async (req, res) => {
    const friends = await Friend.findAll({
        where: { user_id: req.user.id },
        include: [{ model: User, as: "friendInfo", attributes: ["id", "username"] }]
    });

    res.json({ success: true, friends });
});

// SEARCH USERS
router.get("/search", auth, async (req, res) => {
    const query = req.query.query || "";

    try {
        const users = await User.findAll({
            where: {
                username: {
                    [require("sequelize").Op.like]: `%${query}%`
                }
            },
            attributes: ["id", "username", "email"]
        });

        res.json({ success: true, users });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

module.exports = router;
