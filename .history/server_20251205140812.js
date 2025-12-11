require("dotenv").config();
const express = require("express");
const path = require("path");
const { sequelize } = require("./models");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});


const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/friends', require('./routes/friends'));
app.use("/api/auth", require("./routes/authRoutes"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", ({ userId }) => {
    socket.join("user_" + userId);
  });

  socket.on("sendMessage", (msgData) => {
    io.to("user_" + msgData.receiverId).emit("receiveMessage", msgData);
  });
});


// DB connect
sequelize.authenticate()
    .then(() => console.log("MySQL Connected ✔"))
    .catch(err => console.log("DB Error:", err));
// { alter: false }
sequelize.sync()
    .then(() => {
        console.log("Database synced");
    })
    .catch((err) => {
        console.error("Sync error:", err);
    });
app.listen(5000, () => console.log("Server running on port 5000 🚀"));
