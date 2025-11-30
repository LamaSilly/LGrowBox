const loginForm = document.querySelector("#login-form");
const loginStatus = document.querySelector("#login-status");
const configEditor = document.querySelector("#config-editor");
const configStatus = document.querySelector("#config-status");
const latestReadings = document.querySelector("#latest-readings");
const dashboard = document.querySelector("#dashboard");
const loginCard = document.querySelector("#login-card");
const welcomeCard = document.querySelector("#welcome-card");
const logoutBtn = document.querySelector("#logout");

const refreshConfigBtn = document.querySelector("#refresh-config");
const saveConfigBtn = document.querySelector("#save-config");
const refreshLatestBtn = document.querySelector("#refresh-latest");

function getToken() {
  return localStorage.getItem("lgrowbox-token");
}

function setToken(token) {
  if (token) {
    localStorage.setItem("lgrowbox-token", token);
  }
}

function clearToken() {
  localStorage.removeItem("lgrowbox-token");
}

function showDashboard() {
  dashboard.hidden = false;
  loginCard.hidden = true;
  welcomeCard.hidden = false;
}

function showLogin() {
  dashboard.hidden = true;
  loginCard.hidden = false;
  welcomeCard.hidden = true;
}

async function login(password) {
  loginStatus.textContent = "Signing in...";
  loginStatus.className = "status";
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();
    setToken(data.token);
    loginStatus.textContent = "Authenticated";
    loginStatus.classList.add("success");
    showDashboard();
    await Promise.all([loadConfig(), loadLatest()]);
  } catch (err) {
    loginStatus.textContent = "Login failed. Check your password.";
    loginStatus.classList.add("error");
    showLogin();
  }
}

async function loadConfig() {
  configStatus.textContent = "Loading config...";
  configStatus.className = "status";
  try {
    const res = await fetch("/api/config");
    const data = await res.json();
    configEditor.value = JSON.stringify(data, null, 2);
    configStatus.textContent = "Config loaded.";
    configStatus.classList.add("success");
  } catch (err) {
    configStatus.textContent = "Unable to load config.";
    configStatus.classList.add("error");
  }
}

async function saveConfig() {
  configStatus.textContent = "Saving...";
  configStatus.className = "status";
  try {
    const token = getToken();
    const parsed = JSON.parse(configEditor.value);
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, config: parsed }),
    });

    if (!res.ok) {
      const message = (await res.json())?.error || "Save failed";
      throw new Error(message);
    }

    configStatus.textContent = "Config saved.";
    configStatus.classList.add("success");
  } catch (err) {
    configStatus.textContent = err.message || "Invalid data.";
    configStatus.classList.add("error");
  }
}

async function loadLatest() {
  try {
    const res = await fetch("/api/latest?cache=" + Date.now());
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    latestReadings.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    latestReadings.textContent = "No telemetry received yet.";
  }
}

loginForm?.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const password = loginForm.password.value.trim();
  if (!password) return;
  login(password);
});

logoutBtn?.addEventListener("click", () => {
  clearToken();
  showLogin();
});

refreshConfigBtn?.addEventListener("click", () => loadConfig());
saveConfigBtn?.addEventListener("click", () => saveConfig());
refreshLatestBtn?.addEventListener("click", () => loadLatest());

(function init() {
  if (getToken()) {
    showDashboard();
    loadConfig();
    loadLatest();
  } else {
    showLogin();
  }
})();
