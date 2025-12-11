require("dotenv").config();
const express = require("express");
const path = require("path");
const { sequelize } = require("./models");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// STATIC + JSON
app.use(express.json());
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use('/api/friends', require('./routes/friends'));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/messages", require("./routes/messages"));
// HTTP SERVER WRAPPER
const server = http.createServer(app);

// SOCKET.IO SETUP
const io = new Server(server, {
  cors: { origin: "*" },
});

// SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join private room
  socket.on("joinChat", ({ userId }) => {
    socket.join("user_" + userId);
    console.log(`User ${userId} joined room: user_${userId}`);
  });

  // send message
  socket.on("sendMessage", (msgData) => {
    io.to("user_" + msgData.receiverId).emit("receiveMessage", msgData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// DB CONNECT
sequelize
  .authenticate()
  .then(() => console.log("MySQL Connected ✔"))
  .catch((err) => console.log("DB Error:", err));

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Sync error:", err);
  });

// START SERVER (IMPORTANT: server.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
