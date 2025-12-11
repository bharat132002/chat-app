const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // User exist?
    const exist = await User.findOne({ where: { email } });
    if (exist) {
      return res.json({ success: false, msg: "Email already exists" });
    }

    // Password hash
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed
    });

    return res.json({ success: true, msg: "User registered", user });
  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, msg: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      msg: "Login success",
      token,
      user
    });
  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};
