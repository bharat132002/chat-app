const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ success: false, msg: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // decoded me id, username etc. aayega
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: "Invalid token" });
  }
};

module.exports = verifyToken;
