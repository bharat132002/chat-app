// auth.js - handles login/register, token storage, navbar update
const API = ""; // same origin
const tokenKey = "chat_token";

document.addEventListener("DOMContentLoaded", () => {
  // tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      document.querySelectorAll(".form-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(tab === "login" ? "loginForm" : "registerForm").classList.add("active");
      // clear messages
      clearMsg();
    });
  });

  // Attach buttons
  document.getElementById("btnRegister").addEventListener("click", register);
  document.getElementById("btnLogin").addEventListener("click", login);
  document.getElementById("btn-logout").addEventListener("click", logout);

  // auto-load profile if token present
  const t = localStorage.getItem(tokenKey);
  if (t) {
    showUserFromToken(t);
  }
});

// helper to show messages
function showMsg(elId, text, ok=true) {
  const el = document.getElementById(elId);
  el.style.color = ok ? "#DFF7E2" : "#ffd2d2";
  el.textContent = text;
  setTimeout(()=>{ if (el) el.textContent = ""; }, 6000);
}
function clearMsg(){
  ["loginMsg","regMsg"].forEach(id => document.getElementById(id).textContent = "");
}

// REGISTER
async function register() {
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  if (!username || !email || !password) {
    showMsg("regMsg", "All fields required", false);
    return;
  }

  try {
    const res = await fetch(API + "/api/auth/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.success) {
      showMsg("regMsg", "Registered! Logging you in...", true);
      // attempt login automatically
      await login(email, password);
    } else {
      showMsg("regMsg", data.msg || "Register failed", false);
    }
  } catch (err) {
    showMsg("regMsg", err.message || "Network error", false);
  }
}

// LOGIN
async function login(prefilledEmail, prefilledPassword) {
  const email = prefilledEmail || document.getElementById("loginEmail").value.trim();
  const password = prefilledPassword || document.getElementById("loginPassword").value;

  if (!email || !password) {
    showMsg("loginMsg", "Provide email & password", false);
    return;
  }

  try {
    const res = await fetch(API + "/api/auth/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem(tokenKey, data.token);
      showUserFromToken(data.token);
      showMsg("loginMsg", "Login successful", true);
    } else {
      showMsg("loginMsg", data.msg || "Login failed", false);
    }
  } catch (err) {
    showMsg("loginMsg", err.message || "Network error", false);
  }
}

// show user in navbar and reveal logout
async function showUserFromToken(token) {
  document.getElementById("nav-username").classList.remove("hidden");
  document.getElementById("btn-logout").classList.remove("hidden");
  // fetch profile to show actual username (protected)
  try {
    const res = await fetch("/api/auth/profile", {
      method: "GET",
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    if (data.success && data.user) {
      document.getElementById("nav-username").textContent = data.user.username;
    } else {
      // invalid token -> logout
      logout();
    }
  } catch (err) {
    // ignore
  }
}

function logout() {
  localStorage.removeItem(tokenKey);
  document.getElementById("nav-username").classList.add("hidden");
  document.getElementById("btn-logout").classList.add("hidden");
  // return to login tab
  document.querySelectorAll(".tab-btn").forEach(x => x.classList.remove("active"));
  document.querySelector('[data-tab="login"]').classList.add("active");
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("loginForm").classList.add("active");
}
