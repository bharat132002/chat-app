const API = "";
const tokenKey = "chat_token";

document.addEventListener("DOMContentLoaded", () => {

  // tab switch
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      document.getElementById("loginForm").classList.toggle("active", tab === "login");
      document.getElementById("registerForm").classList.toggle("active", tab === "register");

      clearMsg();
    });
  });

  // buttons
  document.getElementById("btnRegister").addEventListener("click", register);
  document.getElementById("btnLogin").addEventListener("click", login);
  document.getElementById("btn-logout").addEventListener("click", logout);

  // auto redirect if logged in
  const t = localStorage.getItem(tokenKey);
  if (t) {
    redirectToChat();
  }
});

function showMsg(id, msg, ok=true) {
  const el = document.getElementById(id);
  el.style.color = ok ? "#DFF7E2" : "#FFB2B2";
  el.textContent = msg;
  setTimeout(()=>el.textContent="", 4000);
}

function clearMsg() {
  document.getElementById("loginMsg").textContent="";
  document.getElementById("regMsg").textContent="";
}

// REGISTER
async function register() {
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  if(!username || !email || !password){
    showMsg("regMsg","All fields required", false);
    return;
  }

  try{
    const res = await fetch(API + "/api/auth/register",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ username,email,password })
    });
    const data = await res.json();

    if(data.success){
      showMsg("regMsg","Registered! Logging you in...");
      await login(email,password);
    } else {
      showMsg("regMsg", data.msg || "Failed", false);
    }

  } catch(err){
    showMsg("regMsg","Network error", false);
  }
}

// LOGIN
async function login(prefilledEmail, prefilledPassword){
  const email = prefilledEmail || document.getElementById("loginEmail").value.trim();
  const password = prefilledPassword || document.getElementById("loginPassword").value;

  if(!email || !password){
    showMsg("loginMsg","Provide email & password", false);
    return;
  }

  try{
    const res = await fetch(API + "/api/auth/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ email,password })
    });
    const data = await res.json();

    if(data.success && data.token){
      localStorage.setItem(tokenKey, data.token);
      redirectToChat();
    } else {
      showMsg("loginMsg", data.msg || "Login failed", false);
    }

  } catch(err){
    showMsg("loginMsg","Network error", false);
  }
}

function redirectToChat(){
  window.location.href = "chat.html";
}

// LOGOUT
function logout(){
  localStorage.removeItem(tokenKey);
  window.location.href = "index.html";
}
