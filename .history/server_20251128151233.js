const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join Group
  socket.on("joinGroup", (groupName) => {
    socket.join(groupName);
    console.log(`${socket.id} joined group: ${groupName}`);
  });

  // Send Group Message
  socket.on("groupMessage", (data) => {
    io.to(data.group).emit("groupMessage", {
      sender: data.sender,
      message: data.message,
      group: data.group,
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
