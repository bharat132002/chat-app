
const socket = io();
const messagesEl = document.getElementById('messages');
const input = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');


const USER = 'user2';
const OTHER = 'user1';


function addMessage(text, who) {
const div = document.createElement('div');
div.classList.add('msg', who === USER ? 'me' : 'you');
div.textContent = text;
messagesEl.appendChild(div);
messagesEl.scrollTop = messagesEl.scrollHeight;
}


sendBtn.addEventListener('click', () => {
const message = input.value.trim();
if (!message) return;
addMessage(message, USER); // show locally
socket.emit('send_message', { sender: USER, message });
input.value = '';
input.focus();
});


input.addEventListener('keypress', (e) => {
if (e.key === 'Enter') sendBtn.click();
});


socket.on('receive_message', (data) => {
// Only show messages coming from the other user
if (data.sender === OTHER) {
addMessage(data.message, OTHER);
}
});
</script>