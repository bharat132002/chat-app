const socket = io();

const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

const username = 'Me';
const receiver = 'Friend';

// Load old messages (optional)
fetch('/api/chat')
    .then(res => res.json())
    .then(messages => {
        messages.forEach(msg => {
            const side = msg.sender === username ? 'right' : 'left';
            addMessage(msg, side);
        });
    });

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    const data = { sender: username, receiver, content: message };
    socket.emit('send_message', data);
    addMessage(data, 'right');
    messageInput.value = '';
}

socket.on('receive_message', data => {
    if (data.receiver === username) {
        addMessage(data, 'left');
    }
});

function addMessage(data, side) {
    const div = document.createElement('div');
    div.classList.add('message', side);
    div.textContent = `${data.content}`;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
