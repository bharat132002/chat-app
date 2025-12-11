require("dotenv").config();
const express = require("express");
const path = require("path");
const { sequelize } = require("./models");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// STATIC + JSON
app.use(express.json());
app.use(express.static("public"));

// ROUTES
app.use("/api/groups", require(__dirname +"./routes/groups"));
app.use("/api/friends", require("./routes/friends"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/messages", require("./routes/messages"));

// HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

// SOCKET HANDLERS
io.on("connection", (socket) => {
  console.log("⚡ User Connected:", socket.id);

  // join personal room
  socket.on("joinChat", (userId) => {
    socket.join("user_" + userId);
    console.log(`📌 User ${userId} joined room user_${userId}`);
  });

  // send private message
  socket.on("sendMessage", (data) => {
    console.log("📨 Sending to room:", "user_" + data.receiverId);

    // send to receiver
    io.to("user_" + data.receiverId).emit("receiveMessage", data);

    // also send to sender (so message reflects instantly)
    io.to("user_" + data.senderId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// DB
sequelize.authenticate().then(() => console.log("MySQL Connected ✔"));
sequelize.sync().then(() => console.log("DB Synced"));

// START SERVER
server.listen(5000, () => console.log("🚀 Server running on 5000"));
