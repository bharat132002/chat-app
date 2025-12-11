const API = ""; // same origin
const tokenKey = "chat_token";

document.addEventListener("DOMContentLoaded", () => {
  // Tabs switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (event) => {  // ✅ event parameter add
      document.querySelectorAll(".tab-btn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      document.querySelectorAll(".form-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(tab === "login" ? "loginForm" : "registerForm").classList.add("active");

      clearMsg();
    });
  });

  // Buttons
  const btnRegister = document.getElementById("btnRegister");
  const btnLogin = document.getElementById("btnLogin");
  if(btnRegister) btnRegister.addEventListener("click", register);
  if(btnLogin) btnLogin.addEventListener("click", login);

  const btnOut = document.getElementById("btn-logout");
  if(btnOut) btnOut.addEventListener("click", logout);

  // Auto-login if token exists
  const t = localStorage.getItem(tokenKey);
  if (t) redirectToChat();
});

// Show messages
function showMsg(elId, text, ok=true) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.style.color = ok ? "#DFF7E2" : "#ffd2d2";
  el.textContent = text;
  setTimeout(() => { if (el) el.textContent = ""; }, 6000);
}

function clearMsg() {
  ["loginMsg","regMsg"].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = "";
  });
}

// REGISTER
async function register() {
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  if(!username || !email || !password) {
    showMsg("regMsg","All fields required",false);
    return;
  }

  try {
    const res = await fetch(API + "/api/auth/register", {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username,email,password})
    });
    const data = await res.json();

    if(data.success) {
      showMsg("regMsg","Registered! Logging you in...",true);
      await login(email,password); // auto-login
    } else {
      showMsg("regMsg", data.msg || "Register failed", false);
    }
  } catch(err) {
    showMsg("regMsg", err.message || "Network error", false);
  }
}

// LOGIN
async function login(prefilledEmail, prefilledPassword) {
  const email = prefilledEmail || document.getElementById("loginEmail").value.trim();
  const password = prefilledPassword || document.getElementById("loginPassword").value;

  if(!email || !password) {
    showMsg("loginMsg", "Provide email & password", false);
    return;
  }

  try {
    const res = await fetch(API + "/api/auth/login", {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if(res.ok && data.token) {
      localStorage.setItem(tokenKey, data.token);
      redirectToChat();
    } else {
      showMsg("loginMsg", data.msg || "Login failed", false);
    }

  } catch(err) {
    showMsg("loginMsg", err.message || "Network error", false);
  }
}

// REDIRECT
function redirectToChat() {
  window.location.href = "chat.html";
}

// LOGOUT
function logout() {
  localStorage.removeItem(tokenKey);
  const navUser = document.getElementById("nav-username");
  const btnOut = document.getElementById("btn-logout");
  if(navUser) navUser.classList.add("hidden");
  if(btnOut) btnOut.classList.add("hidden");

  document.querySelectorAll(".tab-btn").forEach(x => x.classList.remove("active"));
  document.querySelector('[data-tab="login"]').classList.add("active");
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("loginForm").classList.add("active");
}
