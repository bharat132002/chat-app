document.getElementById("searchInput").addEventListener("keyup", async function () {
    const query = this.value.trim();

    if (query.length === 0) {
        document.getElementById("searchResults").innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/friends/search?username=${query}`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await res.json();
        const results = data.users;

        let html = "";
        results.forEach(user => {
            html += `
                <li class="search-item" data-id="${user.id}">
            <strong>${user.username}</strong>
            <button class="send-req-btn" data-id="${user.id}">Send Request</button>
            <button class="msg-btn" data-id="${user.id}">Message</button>
        </li>`;
        });

        document.getElementById("searchResults").innerHTML = html;

    } catch (err) {
        console.error("Search failed:", err);
    }
});
