const socket = io();

// Send Message
function sendMsg() {
  const input = document.getElementById("msgInput");
  const message = input.value.trim();

  if (!message) return;

  const data = {
    text: message,
    sender: "me"
  };

  socket.emit("sendMsg", data);

  addMessage(message, true);
  input.value = "";
}

// Receive Message
socket.on("receiveMsg", (data) => {
  if (data.sender === "me") return;
  addMessage(data.text, false);
});

// Add Message to ChatBox
function addMessage(text, isMe) {
  const chatBox = document.getElementById("chatBox");

  const div = document.createElement("div");
  div.className = isMe ? "my-msg" : "other-msg";
  div.innerHTML = `<span class="bubble">${text}</span>`;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
