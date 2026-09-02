const bootScreen = document.getElementById("boot-screen");
const lockScreen = document.getElementById("lock-screen");
const loginScreen = document.getElementById("login-screen");
const desktop = document.getElementById("desktop");
const logoBrowser = document.getElementById("logo-browser");
const logoOrbit = document.getElementById("logo-orbit");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const welcomeMsg = document.getElementById("welcome-msg");
const lockGreeting = document.getElementById("lock-greeting");
const lockTime = document.getElementById("lock-time");
const lockDate = document.getElementById("lock-date");
const formTitle = document.getElementById("form-title");
const formMessage = document.getElementById("form-message");
const switchMode = document.getElementById("switch-mode");
const galaxyBg = document.getElementById("galaxy-bg");

let mode = "login";

const canvas = document.getElementById("space-bg");
const ctx = canvas.getContext("2d");
let stars = [];
let shootingStars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function initStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 3000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      baseOpacity: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.05,
      driftY: (Math.random() - 0.5) * 0.05
    });
  }
}
initStars();
window.addEventListener("resize", initStars);

function maybeSpawnShootingStar() {
  if (Math.random() < 0.004 && shootingStars.length < 2) {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height * 0.4;
    shootingStars.push({
      x: startX,
      y: startY,
      len: 80 + Math.random() * 60,
      speed: 12 + Math.random() * 8,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      life: 1
    });
  }
}

function drawSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const s of stars) {
    s.twinklePhase += s.twinkleSpeed;
    const twinkle = (Math.sin(s.twinklePhase) + 1) / 2;
    const opacity = s.baseOpacity * (0.5 + 0.5 * twinkle);

    s.x += s.driftX;
    s.y += s.driftY;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + opacity + ")";
    ctx.fill();
  }

  maybeSpawnShootingStar();

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    const dx = Math.cos(ss.angle) * ss.len;
    const dy = Math.sin(ss.angle) * ss.len;
    const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - dx, ss.y - dy);
    grad.addColorStop(0, "rgba(255,255,255," + ss.life + ")");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ss.x - dx, ss.y - dy);
    ctx.stroke();

    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.life -= 0.02;

    if (ss.life <= 0 || ss.x > canvas.width + 100 || ss.y > canvas.height + 100) {
      shootingStars.splice(i, 1);
    }
  }

  requestAnimationFrame(drawSpace);
}
drawSpace();

function fadeInScreen(el) {
  el.classList.remove("hidden");
  el.classList.add("visible");
}

function runBootSequence() {
  setTimeout(() => {
    startFlicker();
  }, 1500);
}

function startFlicker() {
  logoOrbit.classList.add("spinning");
  bootScreen.classList.add("glitch-active");
  const flickerDuration = 5000 + Math.random() * 10000;
  const startTime = Date.now();

  function glitchTick() {
    const elapsed = Date.now() - startTime;
    if (elapsed > flickerDuration) {
      logoBrowser.style.opacity = 0;
      logoOrbit.style.opacity = 1;
      bootScreen.classList.remove("glitch-active");
      finishBoot();
      return;
    }

    const showOrbit = Math.random() > 0.5;
    logoBrowser.style.opacity = showOrbit ? 0 : 1;
    logoOrbit.style.opacity = showOrbit ? 1 : 0;

    const jitterX = (Math.random() - 0.5) * 14;
    const jitterY = (Math.random() - 0.5) * 14;
    logoBrowser.style.transform = "translate(" + jitterX + "px," + jitterY + "px)";
    logoOrbit.style.transform = "translate(" + jitterX + "px," + jitterY + "px)";

    if (Math.random() > 0.85) {
      setTimeout(() => {
        logoBrowser.style.opacity = showOrbit ? 1 : 0;
        logoOrbit.style.opacity = showOrbit ? 0 : 1;
      }, 20 + Math.random() * 30);
    }

    setTimeout(glitchTick, 30 + Math.random() * 60);
  }

  glitchTick();
}

function finishBoot() {
  bootScreen.style.transition = "opacity 0.6s ease";
  bootScreen.style.opacity = 0;
  setTimeout(() => {
    bootScreen.classList.add("hidden");
    showLockScreen();
  }, 600);
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  lockTime.textContent = hours + ":" + minutes + " " + ampm;

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  lockDate.textContent = days[now.getDay()] + ", " + months[now.getMonth()] + " " + now.getDate();

  let greeting = "Good evening";
  const h = now.getHours();
  if (h < 12) greeting = "Good morning";
  else if (h < 18) greeting = "Good afternoon";
  lockGreeting.textContent = greeting;
}

function showLockScreen() {
  fadeInScreen(lockScreen);
  updateClock();
  setInterval(updateClock, 1000 * 30);

  lockScreen.addEventListener("click", function handler() {
    lockScreen.removeEventListener("click", handler);
    lockScreen.classList.remove("visible");
    setTimeout(() => {
      lockScreen.classList.add("hidden");
      showLoginScreen();
    }, 300);
  });
}

function getAccounts() {
  const raw = localStorage.getItem("orbitos_accounts");
  return raw ? JSON.parse(raw) : {};
}

function saveAccounts(accounts) {
  localStorage.setItem("orbitos_accounts", JSON.stringify(accounts));
}

function showLoginScreen() {
  const lastUser = localStorage.getItem("orbitos_last_user");
  if (lastUser) {
    usernameInput.value = lastUser;
  }
  fadeInScreen(loginScreen);
}

function attachSwitchLinkHandler() {
  const link = document.getElementById("switch-link");
  if (link) {
    link.addEventListener("click", function () {
      setMode(mode === "login" ? "signup" : "login");
    });
  }
}

function setMode(newMode) {
  mode = newMode;
  formMessage.textContent = "";
  if (mode === "signup") {
    formTitle.textContent = "Create your OrbitOS account";
    loginBtn.textContent = "Sign Up";
    switchMode.innerHTML = "Already have an account? <span id=\"switch-link\">Log In</span>";
  } else {
    formTitle.textContent = "Welcome to OrbitOS";
    loginBtn.textContent = "Log In";
    switchMode.innerHTML = "Don't have an account? <span id=\"switch-link\">Sign Up</span>";
  }
  attachSwitchLinkHandler();
}

function fadeWelcomeMessage() {
  setTimeout(() => {
    welcomeMsg.style.opacity = "0";
  }, 1200);
}

function makeWindowInteractive(win) {
  const titlebar = win.querySelector(".window-titlebar");
  const resizeHandle = win.querySelector(".resize-handle");
  const resizeRight = win.querySelector(".resize-edge.right");
  const resizeBottom = win.querySelector(".resize-edge.bottom");
  const closeBtn = win.querySelector('[data-action="close"]');
  const minBtn = win.querySelector('[data-action="minimize"]');
  const fullBtn = win.querySelector('[data-action="fullscreen"]');

  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  titlebar.addEventListener("mousedown", (e) => {
    if (win.classList.contains("fullscreen")) return;
    isDragging = true;
    const rect = win.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    win.style.left = rect.left + "px";
    win.style.top = rect.top + "px";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    win.style.left = (e.clientX - dragOffsetX) + "px";
    win.style.top = (e.clientY - dragOffsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  let resizeMode = null;

  function startResize(m) {
    return (e) => {
      resizeMode = m;
      e.stopPropagation();
    };
  }

  resizeHandle.addEventListener("mousedown", startResize("both"));
  resizeRight.addEventListener("mousedown", startResize("width"));
  resizeBottom.addEventListener("mousedown", startResize("height"));

  document.addEventListener("mousemove", (e) => {
    if (!resizeMode) return;
    const rect = win.getBoundingClientRect();
    if (resizeMode === "width" || resizeMode === "both") {
      const newWidth = e.clientX - rect.left;
      win.style.width = Math.max(260, newWidth) + "px";
    }
    if (resizeMode === "height" || resizeMode === "both") {
      const newHeight = e.clientY - rect.top;
      win.style.height = Math.max(160, newHeight) + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    resizeMode = null;
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      win.classList.add("hidden");
    });
  }

  if (minBtn) {
    minBtn.addEventListener("click", () => {
      win.classList.add("minimizing");
      setTimeout(() => {
        win.classList.add("hidden");
        win.classList.remove("minimizing");
        win.style.transform = "";
      }, 500);
    });
  }

  if (fullBtn) {
    fullBtn.addEventListener("click", () => {
      win.classList.toggle("fullscreen");
    });
  }
}

function openWindow(win) {
  if (!win.classList.contains("hidden")) return;
  win.classList.remove("hidden");
  win.classList.add("restoring");
  setTimeout(() => {
    win.classList.remove("restoring");
    win.style.transform = "";
  }, 550);
}

function setupDock() {
  const settingsWindow = document.getElementById("settings-window");
  const dockSettings = document.getElementById("dock-settings");
  const dock = document.getElementById("dock");

  document.addEventListener("mousemove", (e) => {
    const nearBottom = e.clientY > window.innerHeight - 120;
    if (nearBottom) {
      dock.classList.add("dock-visible");
    } else {
      dock.classList.remove("dock-visible");
    }
  });

  dockSettings.addEventListener("click", () => {
    openWindow(settingsWindow);
  });
}

function setupBrowser() {
  const browserWindow = document.getElementById("browser-window");
  const dockBrowser = document.getElementById("dock-browser");
  const goBtn = document.getElementById("browser-go");
  const homeBtn = document.getElementById("browser-home");
  const urlInput = document.getElementById("browser-url");
  const frame = document.getElementById("browser-frame");
  let loadedOnce = false;

  function navigate(rawUrl) {
    let val = (rawUrl !== undefined ? rawUrl : urlInput.value).trim();
    if (!val) return;

    // 1. Format plain text into a DuckDuckGo search or add https://
    if (!val.includes('.') || val.includes(' ')) {
      val = 'https://duckduckgo.com/?q=' + encodeURIComponent(val);
    } else if (!/^https?:\/\//i.test(val)) {
      val = 'https://' + val;
    }

    // 2. Break out of the workspace container frame to launch a clean tab window
    if (typeof window.__scramjet$config !== 'undefined') {
      const proxyUrl = window.__scramjet$config.prefix + window.__scramjet$config.encodeUrl(val);
      window.open(proxyUrl, '_blank');
    } else {
      window.open(val, '_blank');
    }
  }

  dockBrowser.addEventListener("click", () => {
    openWindow(browserWindow);
    if (!loadedOnce) {
      loadedOnce = true;
      urlInput.value = "";
      navigate("duckduckgo.com");
    }
  });

  homeBtn.addEventListener("click", () => {
    urlInput.value = "";
    navigate("duckduckgo.com");
  });

  goBtn.addEventListener("click", () => navigate());
  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") navigate();
  });
}

function enterDesktop(name) {
  welcomeMsg.textContent = "Welcome, " + name;
  welcomeMsg.style.opacity = "1";
  loginScreen.classList.remove("visible");
  canvas.classList.add("hidden");
  galaxyBg.classList.remove("hidden");
  galaxyBg.play();
  setTimeout(() => {
    loginScreen.classList.add("hidden");
    fadeInScreen(desktop);
    fadeWelcomeMessage();
    setupDock();
    setupBrowser();
    document.querySelectorAll(".app-window").forEach(makeWindowInteractive);
  }, 500);
}

loginBtn.addEventListener("click", function () {
  const name = usernameInput.value.trim();
  const pass = passwordInput.value;

  if (!name || !pass) {
    formMessage.textContent = "Please enter a name and password.";
    return;
  }

  const accounts = getAccounts();

  if (mode === "signup") {
    if (accounts[name]) {
      formMessage.textContent = "That name is already taken.";
      return;
    }
    accounts[name] = { password: pass };
    saveAccounts(accounts);
    localStorage.setItem("orbitos_last_user", name);
    enterDesktop(name);
  } else {
    const account = accounts[name];
    if (!account || account.password !== pass) {
      formMessage.textContent = "Incorrect name or password.";
      return;
    }
    localStorage.setItem("orbitos_last_user", name);
    enterDesktop(name);
  }
});

setMode("login");
runBootSequence();