require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public")); // Serve frontend files

// API ROUTES
app.use("/api/messages", require("./routes/messages"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/friends", require("./routes/friends"));
app.use("/api/groups", require("./routes/groups"));

// Create HTTP server
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // USER JOINS THEIR PERSONAL ROOM
  socket.on("joinRoom", (userId) => {
    socket.join("user_" + userId);
    console.log(`📌 User ${userId} joined room user_${userId}`);
  });

  // HANDLE SENDING MESSAGE
  socket.on("sendMessage", (msgData) => {
    console.log("📨 Message sent to:", msgData.receiverId);

    // Send to receiver
    io.to("user_" + msgData.receiverId).emit("receiveMessage", msgData);

    // Send to sender also (to sync UI)
    io.to("user_" + msgData.senderId).emit("receiveMessage", msgData);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
