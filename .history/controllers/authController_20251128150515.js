const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.json({ success: false, msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.json({ success: true, msg: "User registered", user });
  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ success: false, msg: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, msg: "Incorrect password" });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      "SECRET123",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      msg: "Logged in",
      token,
      user
    });

  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};
