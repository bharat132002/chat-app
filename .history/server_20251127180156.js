const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
cors: { origin: '*' }
});


app.use(express.static('public'));


io.on('connection', (socket) => {
console.log('User connected:', socket.id);


// When a client sends a message, broadcast to all other clients
socket.on('send_message', (data) => {
console.log('Message from', data.sender, ':', data.message);
// Send to all except the sender
socket.broadcast.emit('receive_message', data);
});


socket.on('disconnect', () => {
console.log('User disconnected:', socket.id);
});
});


const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// -----------------------------
//  SERVER.JS (FULL WORKING)
// -----------------------------
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// -----------------------------
// USERS STORE
// -----------------------------
let onlineUsers = {}; // {socketId: username}

// -----------------------------
// SOCKET LOGIC
// -----------------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // -----------------------------
  // USER REGISTER
  // -----------------------------
  socket.on("registerUser", (username) => {
    onlineUsers[socket.id] = username;
    console.log("User Joined:", username);

    io.emit("onlineUsers", onlineUsers);
  });

  // -----------------------------
  // PRIVATE CHAT
  // -----------------------------
  socket.on("privateMessage", (data) => {
    const { sender, receiverId, message } = data;

    io.to(receiverId).emit("privateMessage", {
      sender,
      message,
      senderId: socket.id,
    });
  });

  // -----------------------------
  // GROUP CHAT - JOIN GROUP
  // -----------------------------
  socket.on("joinGroup", (groupName) => {
    socket.join(groupName);
    console.log(`${onlineUsers[socket.id]} joined group: ${groupName}`);

    socket.to(groupName).emit("groupMessage", {
      group: groupName,
      sender: "System",
      message: `${onlineUsers[socket.id]} joined the group.`,
    });
  });

  // -----------------------------
  // GROUP CHAT - SEND MESSAGE
  // -----------------------------
  socket.on("groupMessage", (data) => {
    const { group, sender, message } = data;

    io.to(group).emit("groupMessage", {
      group,
      sender,
      message,
    });
  });

  // -----------------------------
  // DISCONNECT
  // -----------------------------
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    delete onlineUsers[socket.id];
    io.emit("onlineUsers", onlineUsers);
  });
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = 5000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
