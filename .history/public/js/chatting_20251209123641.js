// ================================
// SOCKET CONNECTION
// ================================
const socket = io("http://localhost:5000");

// CURRENT USER ID (Login ke baad localStorage me save hona chahiye)
const currentUser = localStorage.getItem("userId");

// FRIEND (receiver) ID page me hidden input me rakho
// <input type="hidden" id="friendId" value="2" />
const receiverId = document.getElementById("friendId").value;


// ================================
// JOIN PRIVATE ROOM
// ================================
socket.emit("joinChat", currentUser);
console.log("Joined Room: user_" + currentUser);


// ================================
// SEND MESSAGE FUNCTION
// ================================
async function sendMessage() {
    const input = document.getElementById("msgInput");
    const message = input.value.trim();

    if (!message) return;

    const data = {
        senderId: currentUser,
        receiverId: receiverId,
        message: message,
        timestamp: new Date()
    };

    // 1️⃣ SAVE MESSAGE IN DATABASE
    await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    // 2️⃣ SEND REAL-TIME VIA SOCKET
    socket.emit("sendMessage", data);

    // 3️⃣ SHOW IN USER CHAT BOX WITHOUT REFRESH
    appendMessage(data);

    input.value = "";
}


// ================================
// RECEIVE MESSAGE REAL TIME
// ================================
socket.on("receiveMessage", (data) => {
    // SERVER dono ko bhej raha hai (sender + receiver)
    // Par UX ke liye sirf receiver side show kare
    if (data.senderId == receiverId || data.receiverId == currentUser) {
        appendMessage(data);
    }
});


// ================================
// ADD MESSAGE INTO CHAT BOX
// ================================
function appendMessage(data) {
    const box = document.getElementById("chatBox");

    const isMine = data.senderId == currentUser;

    const div = document.createElement("div");
    div.className = isMine ? "myMsg" : "theirMsg";
    div.innerHTML = `<p>${data.message}</p>`;

    box.appendChild(div);

    // Auto scroll bottom
    box.scrollTop = box.scrollHeight;
}


// ================================
// SEND MESSAGE ON ENTER KEY
// ================================
document.getElementById("msgInput").addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
