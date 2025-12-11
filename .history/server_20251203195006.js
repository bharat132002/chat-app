require("dotenv").config();
const express = require("express");
const path = require("path");
const sequelize = require("./sequelize");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/friends', require('./routes/friends'));
app.use("/api/auth", require("./routes/authRoutes"));

// DB connect
sequelize.authenticate()
    .then(() => console.log("MySQL Connected ✔"))
    .catch(err => console.log("DB Error:", err));

sequelize.sync()
    .then(() => {
        console.log("Database synced with alter:true");
    })
    .catch((err) => {
        console.error("Sync error:", err);
    });
app.listen(5000, () => console.log("Server running on port 5000 🚀"));
