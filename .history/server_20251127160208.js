const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
const chatRoutes = require('./routes/chatRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('send_message', (data) => {
        io.emit('receive_message', data); // Sabko send kar dega
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Database sync and server start
sequelize.sync().then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => console.log(err));
