const socket = io();

// AUTH USERS
const currentUser = JSON.parse(localStorage.getItem("user") || "null");
const token = localStorage.getItem("token");

if (!currentUser || !token) window.location.href = "/index.html";

// DOM
const messagesBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("backBtn");
const chatUsernameEl = document.getElementById("chatUsername");

let chattingWithId = null;
let chattingWithName = null;

// INIT
function initChat() {
  chattingWithId = Number(localStorage.getItem("chatUserId"));
  chattingWithName = localStorage.getItem("chatUserName");

  if (!chattingWithId || !chattingWithName) {
    window.location.href = "/index.html";
    return;
  }

  chatUsernameEl.textContent = chattingWithName;

  // USER JOINS THEIR PERSONAL ROOM
  socket.emit("joinRoom", currentUser.id);

  // LOAD OLD MSGS
  loadOldMessages(chattingWithId);
}

initChat();

// RECEIVE MESSAGE (REAL TIME)
socket.on("receiveMessage", (msg) => {
  if (
    Number(msg.senderId) === Number(chattingWithId) ||
    Number(msg.senderId) === Number(currentUser.id)
  ) {
    appendMessage(msg.message, msg.senderId === currentUser.id);
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
    createdAt: new Date().toISOString()
  };

  appendMessage(text, true);

  socket.emit("sendMessage", msgData);

  fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(msgData)
  }).catch(console.error);

  msgInput.value = "";
}

sendBtn.onclick = sendMessage;

msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// MSG UI
function appendMessage(text, outgoing = false) {
  const div = document.createElement("div");
  div.className = "message " + (outgoing ? "out" : "in");
  div.textContent = text;

  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

// LOAD OLD MSG
async function loadOldMessages(friendId) {
  const res = await fetch("/api/messages/" + friendId, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  messagesBox.innerHTML = "";

  data.messages.forEach((msg) => {
    appendMessage(
      msg.message,
      Number(msg.senderId) === Number(currentUser.id)
    );
  });
}
