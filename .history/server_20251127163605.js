const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
const chatRoutes = require('./routes/chatRoutes');
const { postMessage } = require('./controllers/chatController');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

// API route
app.use('/api/chat', chatRoutes);

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('send_message', async (data) => {
        console.log('Message received:', data);
        await postMessage(data); // DB me save
        // Emit only to receiver
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Sync DB & start server
sequelize.sync().then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => console.log(err));
