require("dotenv").config();
const express = require("express");
const app = express();
const sequelize = require("./sequelize");
app.use(express.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const User = require("./models/User"); // IMPORTANT

app.use("/api/auth", require("./routes/authRoutes"));

// DB connect
sequelize.authenticate()
    .then(() => console.log("MySQL Connected"))
    .catch(err => console.log("DB Error:", err));

// Tables create (without sync())
sequelize.sync()
    .then(() => console.log("Tables Ready"))
    .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));
