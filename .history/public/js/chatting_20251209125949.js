// SOCKET
const socket = io("http://localhost:5000");

// USER
const currentUser = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (!currentUser || !token) {
  window.location.href = "/index.html";
}

const messagesBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("backBtn");
const chatUsernameEl = document.getElementById("chatUsername");

let chattingWithId = null;
let chattingWithName = null;

// INIT
function initFromStorage() {
  chattingWithId = localStorage.getItem("chatUserId");
  chattingWithName = localStorage.getItem("chatUserName");

  if (!chattingWithId) window.location.href = "/index.html";

  chatUsernameEl.textContent = chattingWithName;

  // FIXED: correct event name
  socket.emit("joinChat", currentUser.id);

  loadOldMessages(chattingWithId);
}
initFromStorage();

// RECEIVE MESSAGE REAL-TIME
socket.on("receiveMessage", (data) => {
  if (
    Number(data.senderId) === Number(chattingWithId) ||
    Number(data.receiverId) === Number(currentUser.id)
  ) {
    appendMessage(data.message, data.senderId === currentUser.id, data.createdAt);
  }
});

// SEND MESSAGE
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  const msgData = {
    senderId: currentUser.id,
    receiverId: chattingWithId,
    message: text,
    createdAt: new Date().toISOString(),
  };

  // UI instantly
  appendMessage(text, true, msgData.createdAt);

  // send socket
  socket.emit("sendMessage", msgData);

  // save to DB
  fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(msgData),
  });

  msgInput.value = "";
}

// EVENTS
sendBtn.onclick = sendMessage;
msgInput.onkeydown = (e) => e.key === "Enter" && sendMessage();

// BACK
backBtn.onclick = () => {
  localStorage.removeItem("chatUserId");
  localStorage.removeItem("chatUserName");
  window.location.href = "/index.html";
};

// UI
function appendMessage(text, outgoing = false, createdAt = null) {
  const row = document.createElement("div");
  row.className = "msg-row" + (outgoing ? " out" : "");

  const bubble = document.createElement("div");
  bubble.className = outgoing ? "msg out" : "msg in";

  bubble.innerHTML = `
    <div class="text">${text}</div>
    <span class="meta">${formatTime(createdAt)}</span>
  `;

  row.appendChild(bubble);
  messagesBox.appendChild(row);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function formatTime(time) {
  const d = new Date(time);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// LOAD OLD MESSAGES
async function loadOldMessages(friendId) {
  const res = await fetch(`/api/messages/${friendId}`, {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await res.json();

  messagesBox.innerHTML = "";

  data.messages.forEach((m) => {
    appendMessage(
      m.message,
      Number(m.senderId) === currentUser.id,
      m.createdAt
    );
  });
}
