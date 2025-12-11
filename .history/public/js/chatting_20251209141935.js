// SOCKET CONNECT
const socket = io("http://localhost:5000");

// USER DATA
const currentUser = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (!currentUser || !token) {
  window.location.href = "/index.html";
}

const messagesBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const chatUsernameEl = document.getElementById("chatUsername");
const backBtn = document.getElementById("backBtn");

let chattingWithId = null;
let chattingWithName = null;

// ====================== INIT ======================
function initFromStorage() {
  chattingWithId = localStorage.getItem("chatUserId");
  chattingWithName = localStorage.getItem("chatUserName");

  if (!chattingWithId) {
    window.location.href = "/index.html";
    return;
  }

  chatUsernameEl.textContent = chattingWithName;

  // FIXED: server = joinChat
  socket.emit("joinChat", currentUser.id);

  loadOldMessages(chattingWithId);
}
initFromStorage();

// ====================== RECEIVE REALTIME MSG ======================
socket.on("receiveMessage", (data) => {
  if (
    Number(data.senderId) === Number(chattingWithId) ||
    Number(data.receiverId) === Number(currentUser.id)
  ) {
    appendMessage(
      data.message,
      data.senderId === currentUser.id,
      data.createdAt
    );
  }
});

// ====================== SEND MESSAGE ======================
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return; // FIX: empty message issue

  const msgData = {
    senderId: currentUser.id,
    receiverId: chattingWithId,
    message: text,
    createdAt: new Date().toISOString()
  };

  // UI update
  appendMessage(text, true, msgData.createdAt);

  // Send through socket
  socket.emit("sendMessage", msgData);

  // Save into DB
  fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(msgData)
  }).catch(console.error);

  msgInput.value = "";   // FIX: input clear after send
  msgInput.focus();      // FIX: focus stays on input
}

sendBtn.addEventListener("click", sendMessage);

msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// ====================== UI: MESSAGE BUBBLE ======================
function appendMessage(text, outgoing = false, createdAt) {
  const row = document.createElement("div");
  row.className = "msg-row" + (outgoing ? " out" : "");

  const bubble = document.createElement("div");
  bubble.className = (outgoing ? "msg out" : "msg in");

  bubble.innerHTML = `
    <div class="text">${escapeHtml(text)}</div>
    <span class="meta">${formatTime(createdAt)}</span>
  `;

  row.appendChild(bubble);
  messagesBox.appendChild(row);

  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function escapeHtml(str = "") {
  return str.replace(/[&<>]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;"
  }[c]));
}

function formatTime(t) {
  const d = new Date(t);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ====================== OLD MESSAGES ======================
async function loadOldMessages(friendId) {
  try {
    const res = await fetch(`/api/messages/${friendId}`, {
      headers: { Authorization: "Bearer " + token }
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
  } catch (err) {
    console.error("loadOldMessages error", err);
  }
}

// ==============================
// BACK BUTTON WORKING (FINAL FIX)
// ==============================
backBtn.addEventListener("click", () => {
  window.location.href = "friends.html";   // ← yaha apna page name set karo
});
