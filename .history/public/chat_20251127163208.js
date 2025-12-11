const socket = io();

const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Load old messages from DB
fetch('/api/chat')
    .then(res => res.json())
    .then(messages => {
        messages.forEach(msg => {
            const side = msg.sender === 'Me' ? 'right' : 'left';
            addMessage(msg, side);
        });
    });

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message) return;

    const data = { sender: 'Me', receiver: 'Friend', content: message };
    
    socket.emit('send_message', data); // backend ko send
    addMessage(data, 'right'); // apni UI me show
    messageInput.value = '';
});

socket.on('receive_message', (data) => {
    if (data.sender !== 'Me') {
        addMessage(data, 'left');
    }
});

function addMessage(data, side) {
    const div = document.createElement('div');
    div.classList.add('message', side);
    div.textContent = `${data.sender}: ${data.content}`;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
