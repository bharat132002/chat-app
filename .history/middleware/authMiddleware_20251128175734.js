const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ success: false, msg: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ success: false, msg: "Invalid Token" });
    }
};
