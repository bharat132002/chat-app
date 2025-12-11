require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const verifyToken = require("./middleware/authMiddleware");
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const sequelize = require("./config/database");
const { User, Group, GroupMember, Message } = require("./models");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// ================================
// SEQUELIZE SYNC (DIRECT HERE ONLY)
// ================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected ✔");

    await sequelize.sync({ alter: true });
    console.log("Tables synced ✔");
  } catch (err) {
    console.error("DB Error ❌:", err);
  }
})();

// ================================
// SOCKET.IO (FUTURE CHAT USE)
// ================================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    msg: "Profile data",
    user: req.user
  });
});
// ================================
// SERVER START
// ================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));