const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("sendMsg", (data) => {
    io.emit("receiveMsg", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🔥 Server running on http://localhost:5000");
});
