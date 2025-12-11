// --------------------- SOCKET CONNECT ----------------------
const socket = io("http://localhost:5000");  // IMPORTANT: Your backend port

// Logged in user
const currentUser = JSON.parse(localStorage.getItem("user"));
const messagesBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("backBtn");

let chattingWith = null; // the user you are chatting with

// --------------------- JOIN PRIVATE ROOM ----------------------
function openChatPage(friendId, friendName) {
    chattingWith = friendId;

    // Header name update
    document.getElementById("chatUsername").innerText = friendName;

    // Join your private room
    socket.emit("joinChat", { userId: currentUser.id });

    // Load previous messages API (optional)
    loadOldMessages(friendId);
}

// --------------------- SEND MESSAGE ----------------------
sendBtn.addEventListener("click", () => {
    const msg = msgInput.value.trim();
    if (!msg) return;

    const msgData = {
        senderId: currentUser.id,
        receiverId: chattingWith,
        message: msg,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    };

    // UI Outgoing
    appendMessage(msg, true);

    // Emit to backend
    socket.emit("sendMessage", msgData);

    msgInput.value = "";
});

// Enter → Send
msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendBtn.click();
    }
});

// --------------------- RECEIVE MESSAGE ----------------------
socket.on("receiveMessage", (msgData) => {
    if (msgData.senderId === chattingWith) {
        appendMessage(msgData.message, false);
    }
});

// --------------------- BACK BUTTON ----------------------
backBtn.addEventListener("click", () => {
    window.location.href = "/index.html"; // your home page
});

// --------------------- LOAD OLD MESSAGES API ----------------------
function loadOldMessages(friendId) {
    fetch(`/api/messages/${friendId}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
        .then(res => res.json())
        .then(data => {
            messagesBox.innerHTML = "";
            data.messages.forEach(m => {
                appendMessage(m.message, m.senderId === currentUser.id);
            });
        });
}



// --------------------- UI HELPER FUNCTION ----------------------
function appendMessage(text, outgoing = false) {
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
        <span class="meta">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
    `;

    row.appendChild(bubble);
    messagesBox.appendChild(row);
    messagesBox.scrollTop = messagesBox.scrollHeight + 200;
}

function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
