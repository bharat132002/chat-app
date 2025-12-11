// chatting.js (place under public/js/chatting.js)

// ------------- CONFIG -------------
const socket = io(); // connects to same host/port where page served
const currentUser = JSON.parse(localStorage.getItem("user") || "null");
const token = localStorage.getItem("token") || null;

if (!currentUser || !token) {
  // not logged in: go back to index
  window.location.href = "/index.html";
}

const messagesBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("backBtn");
const chatUsernameEl = document.getElementById("chatUsername");

let chattingWithId = null;
let chattingWithName = null;

// ------------- ENTRY: load chat target from localStorage -------------
function initFromStorage() {
  const friendId = localStorage.getItem("chatUserId");
  const friendName = localStorage.getItem("chatUserName");

  if (!friendId || !friendName) {
    // no chat target — go back
    window.location.href = "/index.html";
    return;
  }

  chattingWithId = Number(friendId);
  chattingWithName = friendName;
  chatUsernameEl.textContent = chattingWithName;

  // join own personal room on server
  socket.emit("joinRoom", String(currentUser.id));
  // optionally join friend's room as well (not required)
  // socket.emit("joinRoom", String(chattingWithId));

  // load previous messages from API (optional)
  loadOldMessages(chattingWithId);
}
initFromStorage();


// ------------- socket events -------------
socket.on("connect", () => {
  // join room again on reconnect
  socket.emit("joinRoom", String(currentUser.id));
});

// server will emit receiveMessage when someone sends to me
socket.on("receiveMessage", (msgData) => {
  // only show if it's for current chat
  if (Number(msgData.senderId) === Number(chattingWithId) &&
      Number(msgData.receiverId) === Number(currentUser.id)) {
    appendMessage(msgData.message, false);
  }
});

// ------------- send message (UI) -------------
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  const msgData = {
    senderId: currentUser.id,
    receiverId: chattingWithId,
    message: text,
    time: new Date().toISOString()
  };

  // optimistic UI
  appendMessage(text, true);

  // emit to server via socket (real-time)
  socket.emit("sendMessage", msgData);

  // also persist message via API so history is saved
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
msgInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } });

// ------------- back button -------------
backBtn.addEventListener("click", () => {
  // clear chatUser storage
  localStorage.removeItem("chatUserId");
  localStorage.removeItem("chatUserName");
  // simple animation (optional)
  backBtn.style.transform = 'translateY(2px)';
  setTimeout(()=> backBtn.style.transform = '', 160);
  window.location.href = "/index.html";
});

// ------------- helpers -------------
function appendMessage(text, outgoing=false) {
  const row = document.createElement("div");
  row.className = "msg-row" + (outgoing ? " out" : "");

  const bubble = document.createElement("div");
  bubble.className = (outgoing ? "msg out" : "msg in") + " animate";
  bubble.innerHTML = `
    <div class="msg-toolbar">
      <div class="action-pill">👍</div>
      <div class="action-pill">❤️</div>
      <div class="action-pill">⋯</div>
    </div>
    <div class="text">${escapeHtml(text)}</div>
    <span class="meta">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
  `;

  row.appendChild(bubble);
  messagesBox.appendChild(row);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function escapeHtml(str = "") {
  return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

// ------------- load old messages (optional) -------------
async function loadOldMessages(friendId) {
  try {
    const res = await fetch(`/api/messages/${friendId}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok) return;
    const data = await res.json();
    messagesBox.innerHTML = "";
    data.messages.forEach(m => {
      const outgoing = Number(m.senderId) === Number(currentUser.id);
      appendMessage(m.message, outgoing);
    });
  } catch (err) {
    console.error("loadOldMessages error", err);
  }
}
function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) minutes = '0' + minutes;

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
}