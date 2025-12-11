const API = "";
const token = localStorage.getItem("chat_token");

// SEARCH FUNCTION (live search with debounce)
let timer = null;
document.getElementById("searchInput").addEventListener("keyup", () => {
    clearTimeout(timer);
    timer = setTimeout(searchUsers, 300); // debounce
});

async function searchUsers() {
    const query = document.getElementById("searchInput").value;
    const resultsBox = document.getElementById("searchResults");

    resultsBox.innerHTML = "<p style='color:white;'>Searching...</p>";

    try {
        const res = await fetch(API + "/api/friends/search?query=" + query, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();

        if (!data.success) {
            resultsBox.innerHTML = "<p>Error fetching users</p>";
            return;
        }

        // SHOW USERS
        resultsBox.innerHTML = "";
        data.users.forEach(user => {
            const div = document.createElement("div");
            div.textContent = user.username + " (" + user.email + ")";
            div.dataset.userid = user.id;

            div.addEventListener("click", () => {
                alert("Friend Request sent to " + user.username);
                // Yaha aap addFriend() function call kar sakte ho
            });

            resultsBox.appendChild(div);
        });

    } catch (err) {
        resultsBox.innerHTML = "<p style='color:red;'>Network Error</p>";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("chat_token");
  if(!token) return window.location.href="index.html";

  try{
    const res = await fetch("/api/auth/profile", {
      headers: { Authorization: "Bearer "+token }
    });
    const data = await res.json();
    if(data.success) document.getElementById("nav-username").textContent = data.user.username;
    else window.location.href="index.html";
  } catch {
    window.location.href="index.html";
  }

  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("chat_token");
    window.location.href="index.html";
  });
});
