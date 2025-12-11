// chatting.js

const socket = io();
const currentUser = JSON.parse(localStorage.getItem("user") || "null");
const token = localStorage.getItem("token") || null;

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

// ---------------- INIT ----------------
function initFromStorage() {
  const friendId = localStorage.getItem("chatUserId");
  const friendName = localStorage.getItem("chatUserName");

  if (!friendId || !friendName) {
    window.location.href = "/index.html";
    return;
  }

  chattingWithId = Number(friendId);
  chattingWithName = friendName;
  chatUsernameEl.textContent = chattingWithName;

  // socket.emit("joinRoom", String(currentUser.id));

  loadOldMessages(chattingWithId);
}
initFromStorage();

// ---------------- SOCKET EVENTS ----------------
socket.on("receiveMessage", (msgData) => {
  if (
    Number(msgData.senderId) === Number(chattingWithId) &&
    Number(msgData.receiverId) === Number(currentUser.id)
  ) {
    appendMessage(msgData.message, false, msgData.createdAt);
  }
});

// ---------------- SEND MESSAGE ----------------
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  const msgData = {
    senderId: currentUser.id,
    receiverId: chattingWithId,
    message: text
  };

  // optimistic UI
  appendMessage(text, true, new Date().toISOString());

  socket.emit("sendMessage", msgData);

  fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(msgData)
  }).catch(err => console.error("persist msg error", err));

  msgInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// ---------------- BACK BUTTON ----------------
backBtn.addEventListener("click", () => {
  localStorage.removeItem("chatUserId");
  localStorage.removeItem("chatUserName");
  window.location.href = "/index.html";
});

// ---------------- MESSAGE UI ----------------
function appendMessage(text, outgoing = false, createdAt = null) {
  const row = document.createElement("div");
  row.className = "msg-row" + (outgoing ? " out" : "");

  const bubble = document.createElement("div");
  bubble.className = (outgoing ? "msg out" : "msg in") + " animate";

  const finalTime = createdAt ? formatTime(createdAt) : formatTime(new Date());

  bubble.innerHTML = `
    <div class="msg-toolbar">
      <div class="action-pill">👍</div>
      <div class="action-pill">❤️</div>
      <div class="action-pill">⋯</div>
    </div>
    <div class="text">${escapeHtml(text)}</div>
    <span class="meta">${finalTime}</span>
  `;

  row.appendChild(bubble);
  messagesBox.appendChild(row);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatTime(dateString) {
  const date = new Date(dateString);
  let h = date.getHours();
  let m = date.getMinutes();

  if (m < 10) m = "0" + m;

  let ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${h}:${m} ${ampm}`;
}

// ---------------- LOAD OLD MESSAGES ----------------
async function loadOldMessages(friendId) {
  try {
    const res = await fetch(`/api/messages/${friendId}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();

    messagesBox.innerHTML = "";

    data.messages.forEach(m => {
      const outgoing = Number(m.senderId) === Number(currentUser.id);
      appendMessage(m.message, outgoing, m.createdAt);
    });

  } catch (err) {
    console.error("loadOldMessages error", err);
  }
}
