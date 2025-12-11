const socket = io(); // ye automatically localhost:5000 connect karega

const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message) return;

    const data = { sender: 'Me', receiver: 'Friend', content: message };
    
    socket.emit('send_message', data); // <-- backend me same event name hona chahiye
    addMessage(data, 'right'); // apne UI me turant show
    messageInput.value = '';
});

// Dusre user ke messages receive karna
socket.on('receive_message', (data) => {
    if (data.sender !== 'Me') {
        addMessage(data, 'left');
    }
});

// UI me add karne ka function
function addMessage(data, side) {
    const div = document.createElement('div');
    div.classList.add('message', side);
    div.textContent = `${data.sender}: ${data.content}`;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
