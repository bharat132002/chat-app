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