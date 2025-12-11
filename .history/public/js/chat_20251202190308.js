
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
