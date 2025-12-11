require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));  // frontend serve

// Routes
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
  console.log("⚡ User Connected:", socket.id);

  // USER JOINS THEIR PERSONAL ROOM
  socket.on("joinChat", ({ userId }) => {
    socket.join("user_" + userId);
    console.log(`📌 User ${userId} joined room user_${userId}`);
  });

  // HANDLE MESSAGE SENDING
  socket.on("sendMessage", (data) => {
    console.log("📨 Sending to:", data.receiverId);

    // SEND TO RECEIVER
    io.to("user_" + data.receiverId).emit("receiveMessage", data);

    // OPTIONAL: also send to sender’s screen
    io.to("user_" + data.senderId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("🚀 Server running on port " + PORT));
