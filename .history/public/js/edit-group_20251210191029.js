const groupId = new URLSearchParams(window.location.search).get("id");
const token = localStorage.getItem("token");

const avatarPreview = document.getElementById("avatarPreview");
const photoInput = document.getElementById("photoInput");
const groupName = document.getElementById("groupName");
const groupBio = document.getElementById("groupBio");
const membersList = document.getElementById("membersList");
const status = document.getElementById("status");

// ================= LOAD GROUP DATA ==================
async function loadGroup() {
  try {
    const res = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    if (!data.success) {
      status.textContent = "❌ " + data.msg;
      return;
    }

    const g = data.group;

    groupName.value = g.name;
    groupBio.value = g.bio || "";

    // Photo
    if (g.photo) {
      avatarPreview.style.backgroundImage = `url(${g.photo})`;
      avatarPreview.textContent = "";
    }

    // List Members
    g.members.forEach((m) => {
      const div = document.createElement("div");
      div.className = "member-pill";
      div.textContent = `${m.userId} (${m.role})`;
      membersList.appendChild(div);
    });

    status.textContent = "✔ Loaded";
  } catch (err) {
    status.textContent = "Server error loading group";
  }
}

loadGroup();


// ================= PHOTO PREVIEW ==================
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (file) {
    avatarPreview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    avatarPreview.textContent = "";
  }
});


// ================= SAVE CHANGES ==================
document.getElementById("saveBtn").addEventListener("click", async () => {

  const formData = new FormData();
  formData.append("name", groupName.value);
  formData.append("bio", groupBio.value);

  if (photoInput.files[0]) {
    formData.append("photo", photoInput.files[0]);
  }

  status.textContent = "⏳ Saving...";

  try {
    const res = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });

    const data = await res.json();

    if (!data.success) {
      status.textContent = "❌ " + data.msg;
      return;
    }

    status.textContent = "✔ Group Updated!";
  } catch (e) {
    status.textContent = "Server error!";
  }
});


// ================= ADD MEMBERS ==================
document.getElementById("addMembersBtn").addEventListener("click", async () => {
  const raw = document.getElementById("memberInput").value.trim();
  if (!raw) return;

  const ids = raw.split(",").map(x => Number(x.trim()));

  try {
    const res = await fetch(`http://localhost:5000/api/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userIds: ids })
    });

    const data = await res.json();

    if (!data.success) {
      status.textContent = "❌ " + data.msg;
      return;
    }

    status.textContent = "✔ Members Added!";
    location.reload();

  } catch (err) {
    status.textContent = "Server error adding members";
  }
});
