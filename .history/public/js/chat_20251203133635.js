const API = ""; // same origin
const tokenKey = "chat_token";

async function searchFriend() {
    const input = document.getElementById("searchFriendInput").value.trim();
    const resultBox = document.getElementById("searchResults");

    if (!input) {
        resultBox.innerHTML = `<p style='color:#ffaaaa;'>Type a username...</p>`;
        return;
    }

    try {
        const token = localStorage.getItem(tokenKey);

        const res = await fetch(`/api/friends/search?username=${input}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        // No results
        if (!Array.isArray(data) || data.length === 0) {
            resultBox.innerHTML = `<p style='color:#ffaaaa;'>No users found.</p>`;
            return;
        }

        // Create results list
        resultBox.innerHTML = data.map(user => `
            <div style="
                padding:12px; 
                background:rgba(255,255,255,0.1); 
                border-radius:10px; 
                margin-bottom:10px;
                display:flex; 
                justify-content:space-between; 
                align-items:center;
            ">
                <span>${user.username}</span>

                <button onclick="sendRequest(${user.id})"
                    style="
                        padding:6px 14px;
                        border:none;
                        background:#4b8bff;
                        color:white;
                        border-radius:8px;
                        cursor:pointer;
                    ">
                    Add Friend
                </button>
            </div>
        `).join("");

    } catch (err) {
        console.error("Search Error:", err);
        resultBox.innerHTML = `<p style='color:#ffaaaa;'>Error fetching users</p>`;
    }
}
