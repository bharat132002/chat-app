const {User} = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ success: false, msg: "All fields required" });

        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(400).json({ success: false, msg: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashed });

        return res.json({ success: true, msg: "Registered successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ success: false, msg: "Invalid email" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, msg: "Invalid password" });

        const token = jwt.sign({ id: user.id  }, process.env.JWT_SECRET);
        return res.json({ success: true, token });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

exports.profile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: ["id","username","email"] });
        return res.json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};
