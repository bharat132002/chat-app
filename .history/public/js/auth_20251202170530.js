// auto-login redirect
const tokenKey = "chat_token";

document.addEventListener("DOMContentLoaded", () => {
  const t = localStorage.getItem(tokenKey);
  if(t) window.location.href="chat.html";

  document.getElementById("btnLogin").addEventListener("click", login);
  document.getElementById("btnRegister").addEventListener("click", register);
});

async function login(){
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("/api/auth/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  });

  const data = await res.json();
  if(data.success){
    localStorage.setItem(tokenKey, data.token);
    window.location.href="chat.html";
  } else {
    alert(data.msg);
  }
}

async function register(){
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch("/api/auth/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,email,password})
  });

  const data = await res.json();
  if(data.success){
    alert("Registered! Logging in...");
    await login(email,password);
  } else {
    alert(data.msg);
  }
}
