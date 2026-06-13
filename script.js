const video      = document.getElementById("video");
const bar        = document.getElementById("bar");
const timeEl     = document.getElementById("time");
const title      = document.getElementById("title");
const phrase     = document.getElementById("phrase");
const card       = document.getElementById("card");
const footerHint = document.getElementById("footer-hint");
const rippleCont = document.getElementById("ripple-container");
const clickBtn   = document.getElementById("click-btn");
const clickCount = document.getElementById("click-count");
const clickSub   = document.getElementById("click-sub");
const moodsEl    = document.getElementById("moods");
const moodResult = document.getElementById("mood-result");
const statViews  = document.getElementById("stat-views");
const statPauses = document.getElementById("stat-pauses");
const statSeeks  = document.getElementById("stat-seeks");
const secretBtn  = document.getElementById("secret-btn");
const secretHint = document.getElementById("secret-hint");

const phrases = [
  "Видео само себя не посмотрит 👀",
  "Перемотка запрещена системой 😏",
  "Добро пожаловать в режим просмотра",
  "Ничего подозрительного не происходит"
];
phrase.textContent = phrases[Math.floor(Math.random() * phrases.length)];

for (let i = 0; i < 20; i++) {
  const p = document.createElement("div");
  p.className = "particle";
  p.style.left = Math.random() * 100 + "vw";
  p.style.animationDuration = (8 + Math.random() * 14) + "s";
  p.style.animationDelay = (Math.random() * 10) + "s";
  p.style.opacity = 0.15 + Math.random() * 0.4;
  document.body.appendChild(p);
}

const toast = document.createElement("div");
toast.className = "toast";
document.body.appendChild(toast);

function showToast(msg, duration = 2000) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), duration);
}

function bumpEl(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 300);
}

function floatEmoji(emoji, x, y) {
  const el = document.createElement("div");
  el.className = "float-emoji";
  el.textContent = emoji;
  el.style.left = x + "px";
  el.style.top  = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

video.muted = true;
video.play().catch(() => {});

const saved = localStorage.getItem("videoTime");
if (saved && parseFloat(saved) > 0) video.currentTime = parseFloat(saved);

let views  = parseInt(localStorage.getItem("stat_views")  || "1");
let pauses = parseInt(localStorage.getItem("stat_pauses") || "0");
let seeks  = parseInt(localStorage.getItem("stat_seeks")  || "0");

statViews.textContent  = views;
statPauses.textContent = pauses;
statSeeks.textContent  = seeks;

let maxReached = 0;
let tapCount = 0;
let titleTapTimer = null;
let shakeCount = 0;
let half50shown = false;

function fmt(sec) {
  const s = Math.floor(sec);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

video.addEventListener("timeupdate", () => {
  localStorage.setItem("videoTime", video.currentTime);
  if (video.currentTime > maxReached) maxReached = video.currentTime;
  const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
  bar.style.width = pct + "%";
  timeEl.textContent = fmt(video.currentTime);
  if (pct > 50 && !half50shown) {
    half50shown = true;
    showToast("половина пути 🎯");
  }
});

video.addEventListener("seeking", () => {
  if (video.currentTime > maxReached + 1) {
    video.currentTime = maxReached;
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 500);
    seeks++;
    localStorage.setItem("stat_seeks", seeks);
    statSeeks.textContent = seeks;
    bumpEl(statSeeks);
    showToast("перемотка заблокирована 🔒");
  }
});

video.addEventListener("ended", () => {
  title.textContent = "Готово ✅";
  localStorage.removeItem("videoTime");
  footerHint.textContent = "ты досмотрел до конца. уважаю.";
  views++;
  localStorage.setItem("stat_views", views);
  statViews.textContent = views;
  bumpEl(statViews);
  confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
});

video.addEventListener("play", () => card.classList.add("glowing"));

video.addEventListener("pause", () => {
  card.classList.remove("glowing");
  pauses++;
  localStorage.setItem("stat_pauses", pauses);
  statPauses.textContent = pauses;
  bumpEl(statPauses);
  showToast("пауза... зачем? 🤔");
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    title.textContent = "Вернись 👀";
  } else {
    title.textContent = "@se7endm0";
    showToast("добро пожаловать обратно 👋");
  }
});

title.addEventListener("click", (e) => {
  tapCount++;
  clearTimeout(titleTapTimer);
  title.classList.add("spin");
  setTimeout(() => title.classList.remove("spin"), 500);
  if (tapCount === 3)  showToast("хм, интересно 🤔");
  if (tapCount === 5)  showToast("ты точно что-то ищешь 🔍");
  if (tapCount === 7) {
    showToast("🥚 пасхалка найдена!");
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 }, colors: ["#6a5cff", "#00d4ff", "#fff"] });
    footerHint.textContent = "секрет: нажми 7 раз на заголовок";
  }
  titleTapTimer = setTimeout(() => { tapCount = 0; }, 2000);
});

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "k") {
    title.textContent = "🥚 found";
    setTimeout(() => { title.textContent = "@se7endm0"; }, 2000);
  }
});

let clicks = parseInt(localStorage.getItem("clicker") || "0");
clickCount.textContent = clicks;

const clickMilestones = {
  10:   "уже 10 кликов, серьёзно?",
  50:   "50 кликов. ты в порядке? 😅",
  100:  "💯 сотня! легенда",
  250:  "250... это уже проблема 🤔",
  500:  "500 кликов. ты психованный",
  1000: "1000 🤯 тебя не остановить"
};

const clickEmojis = ["✨","💫","⚡","🌟","💥","🎯","🔥","👾"];

clickBtn.addEventListener("click", (e) => {
  clicks++;
  localStorage.setItem("clicker", clicks);
  clickCount.textContent = clicks;

  const rect = clickBtn.getBoundingClientRect();
  const ex = rect.left + rect.width / 2 + (Math.random() * 40 - 20);
  const ey = rect.top - 10;
  floatEmoji(clickEmojis[Math.floor(Math.random() * clickEmojis.length)], ex, ey);

  if (clickMilestones[clicks]) {
    showToast(clickMilestones[clicks], 2500);
    if (clicks >= 100) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ["#6a5cff","#00d4ff"] });
    }
  }

  if (clicks < 10)        clickSub.textContent = "жми пока не надоест";
  else if (clicks < 50)   clickSub.textContent = "не останавливайся...";
  else if (clicks < 100)  clickSub.textContent = "ты почти на сотке 👀";
  else if (clicks < 500)  clickSub.textContent = "ты маньяк кликов";
  else                    clickSub.textContent  = "ты сломал кликер 💀";
});

const moodLabels = {
  "🔥": ["чисто огонь", "горит как надо", "🔥🔥🔥"],
  "😴": ["ну и ладно", "спи давай", "понимаю, бывает"],
  "👾": ["ретро-режим", "олдскул форева", "8-битное настроение"],
  "💀": ["RIP настроение", "мертвее некуда", "R.I.P. 💀"],
  "✨": ["кайф", "всё по феншую", "золото"]
};

moodsEl.querySelectorAll(".mood").forEach(btn => {
  btn.addEventListener("click", () => {
    moodsEl.querySelectorAll(".mood").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const labels = moodLabels[btn.dataset.mood];
    moodResult.textContent = labels[Math.floor(Math.random() * labels.length)];
    moodResult.style.color = "rgba(255,255,255,0.7)";
    navigator.vibrate && navigator.vibrate(30);
    floatEmoji(btn.dataset.mood,
      btn.getBoundingClientRect().left + 10,
      btn.getBoundingClientRect().top - 10
    );
  });
});

let secretPresses = 0;
const secretMessages = [
  "ничего не произошло",
  "снова ничего",
  "ну и что?",
  "...",
  "ладно стоп",
  "🥚 ты нашёл ЭТО"
];

secretBtn.addEventListener("click", (e) => {
  secretPresses++;
  navigator.vibrate && navigator.vibrate(20);

  const rect = secretBtn.getBoundingClientRect();
  floatEmoji("❓", rect.left + rect.width / 2, rect.top - 10);

  if (secretPresses < secretMessages.length) {
    secretHint.textContent = secretMessages[secretPresses - 1];
    secretBtn.textContent = "???".repeat(Math.min(secretPresses, 3));
  } else {
    secretHint.textContent = "🥚 ты нашёл ЭТО";
    secretBtn.textContent  = "💀";
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.7 },
      colors: ["#ff4fd8", "#6a5cff", "#00d4ff", "#fff"]
    });
    showToast("секрет раскрыт 🎉", 3000);
  }
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 80 && Math.abs(dy) < 40) {
    showToast(dx < 0 ? "некуда идти →" : "← тоже некуда");
  }
  if (Math.abs(dy) > 120 && Math.abs(dx) < 40 && dy < 0) {
    shakeCount++;
    if (shakeCount >= 3) {
      shakeCount = 0;
      showToast("✨ тряска активирована");
      confetti({ particleCount: 40, spread: 100, origin: { y: 0.5 }, gravity: 0.3 });
    }
  }
}, { passive: true });

document.addEventListener("touchstart", (e) => {
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  const r = document.createElement("div");
  r.className = "ripple";
  r.style.left   = (x - 30) + "px";
  r.style.top    = (y - 30) + "px";
  r.style.width  = "60px";
  r.style.height = "60px";
  rippleCont.appendChild(r);
  setTimeout(() => r.remove(), 900);
}, { passive: true });

let longPressTimer = null;
document.addEventListener("touchstart", () => {
  longPressTimer = setTimeout(() => {
    showToast("долгое нажатие обнаружено 👁", 2500);
    navigator.vibrate && navigator.vibrate([50, 30, 50]);
  }, 800);
}, { passive: true });
document.addEventListener("touchend",  () => clearTimeout(longPressTimer), { passive: true });
document.addEventListener("touchmove", () => clearTimeout(longPressTimer), { passive: true });

// ===================== SNAKE GAME =====================
const snakeCanvas  = document.getElementById("snake-canvas");
const snakeCtx     = snakeCanvas.getContext("2d");
const snakeOverlay = document.getElementById("snake-overlay");
const snakeMsg     = document.getElementById("snake-msg");
const snakeScore   = document.getElementById("snake-score");
const snakeBest    = document.getElementById("snake-best");

const CELL = 20;
const COLS = snakeCanvas.width  / CELL;
const ROWS = snakeCanvas.height / CELL;

let snake, dir, nextDir, food, snakeInterval, sScore, sRunning = false;
let sBest = parseInt(localStorage.getItem("snake_best") || "0");
snakeBest.textContent = sBest;

function snakeRand() {
  return { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
}

function placeFood(body) {
  let f;
  do { f = snakeRand(); } while (body.some(s => s.x === f.x && s.y === f.y));
  return f;
}

function initSnake() {
  snake    = [{ x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }];
  dir      = { x: 1, y: 0 };
  nextDir  = { x: 1, y: 0 };
  food     = placeFood(snake);
  sScore   = 0;
  snakeScore.textContent = 0;
}

function drawSnake() {
  snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  // grid
  snakeCtx.strokeStyle = "rgba(255,255,255,0.04)";
  snakeCtx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) { snakeCtx.beginPath(); snakeCtx.moveTo(x*CELL,0); snakeCtx.lineTo(x*CELL,snakeCanvas.height); snakeCtx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { snakeCtx.beginPath(); snakeCtx.moveTo(0,y*CELL); snakeCtx.lineTo(snakeCanvas.width,y*CELL); snakeCtx.stroke(); }

  // food
  snakeCtx.fillStyle = "#ff4fd8";
  snakeCtx.shadowColor = "#ff4fd8";
  snakeCtx.shadowBlur = 12;
  snakeCtx.beginPath();
  snakeCtx.arc(food.x*CELL+CELL/2, food.y*CELL+CELL/2, CELL/2-2, 0, Math.PI*2);
  snakeCtx.fill();
  snakeCtx.shadowBlur = 0;

  // snake
  snake.forEach((s, i) => {
    const t = i / snake.length;
    snakeCtx.fillStyle = i === 0 ? "#00d4ff" : `hsl(${200 + t*60},100%,${60 - t*20}%)`;
    snakeCtx.shadowColor = i === 0 ? "#00d4ff" : "transparent";
    snakeCtx.shadowBlur  = i === 0 ? 10 : 0;
    snakeCtx.beginPath();
    snakeCtx.roundRect(s.x*CELL+1, s.y*CELL+1, CELL-2, CELL-2, 4);
    snakeCtx.fill();
  });
  snakeCtx.shadowBlur = 0;
}

function stepSnake() {
  dir = { ...nextDir };
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      snake.some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(snakeInterval);
    sRunning = false;
    snakeOverlay.style.display = "flex";
    if (sScore > sBest) {
      sBest = sScore;
      localStorage.setItem("snake_best", sBest);
      snakeBest.textContent = sBest;
      snakeMsg.textContent = "новый рекорд! 🏆";
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    } else {
      snakeMsg.textContent = `игра окончена 💀 (счёт: ${sScore})`;
    }
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    sScore++;
    snakeScore.textContent = sScore;
    food = placeFood(snake);
    navigator.vibrate && navigator.vibrate(15);
    if (sScore % 5 === 0) showToast(`змейка растёт 🐍 (${sScore})`);
  } else {
    snake.pop();
  }
  drawSnake();
}

function startSnake() {
  if (sRunning) return;
  sRunning = true;
  snakeOverlay.style.display = "none";
  initSnake();
  drawSnake();
  const speed = 150;
  snakeInterval = setInterval(stepSnake, speed);
}

snakeOverlay.addEventListener("click", startSnake);
snakeCanvas.addEventListener("click", () => { if (!sRunning) startSnake(); });

document.getElementById("s-up").addEventListener("click",    () => { if (dir.y !== 1)  nextDir = { x:0, y:-1 }; });
document.getElementById("s-down").addEventListener("click",  () => { if (dir.y !== -1) nextDir = { x:0, y:1  }; });
document.getElementById("s-left").addEventListener("click",  () => { if (dir.x !== 1)  nextDir = { x:-1,y:0  }; });
document.getElementById("s-right").addEventListener("click", () => { if (dir.x !== -1) nextDir = { x:1, y:0  }; });

document.addEventListener("keydown", (e) => {
  if (!sRunning) { if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) { e.preventDefault(); startSnake(); } return; }
  if (e.key === "ArrowUp"    && dir.y !== 1)  { e.preventDefault(); nextDir = { x:0, y:-1 }; }
  if (e.key === "ArrowDown"  && dir.y !== -1) { e.preventDefault(); nextDir = { x:0, y:1  }; }
  if (e.key === "ArrowLeft"  && dir.x !== 1)  { e.preventDefault(); nextDir = { x:-1,y:0  }; }
  if (e.key === "ArrowRight" && dir.x !== -1) { e.preventDefault(); nextDir = { x:1, y:0  }; }
});

// swipe on canvas
let cTouchX = 0, cTouchY = 0;
snakeCanvas.addEventListener("touchstart", e => { cTouchX = e.touches[0].clientX; cTouchY = e.touches[0].clientY; e.preventDefault(); }, { passive: false });
snakeCanvas.addEventListener("touchend", e => {
  if (!sRunning) { startSnake(); return; }
  const dx = e.changedTouches[0].clientX - cTouchX;
  const dy = e.changedTouches[0].clientY - cTouchY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20 && dir.x !== -1) nextDir = { x:1,  y:0 };
    if (dx < -20 && dir.x !== 1)  nextDir = { x:-1, y:0 };
  } else {
    if (dy > 20 && dir.y !== -1) nextDir = { x:0, y:1  };
    if (dy < -20 && dir.y !== 1)  nextDir = { x:0, y:-1 };
  }
  e.preventDefault();
}, { passive: false });

drawSnake();

// ===================== ACHIEVEMENTS =====================
const allAchieves = [
  { id:"first_click",   emoji:"👆", label:"первый клик",    desc:"кликни хоть раз",       check: () => clicks >= 1 },
  { id:"clicker100",    emoji:"💯", label:"100 кликов",     desc:"настоящий кликер",       check: () => clicks >= 100 },
  { id:"clicker500",    emoji:"🔥", label:"500 кликов",     desc:"ты не в порядке",        check: () => clicks >= 500 },
  { id:"video_half",    emoji:"📽",  label:"половина",       desc:"досмотри до 50%",        check: () => half50shown },
  { id:"video_end",     emoji:"✅", label:"до конца",       desc:"посмотри видео целиком", check: () => parseInt(localStorage.getItem("stat_views")||0) >= 2 },
  { id:"mood_set",      emoji:"🎭", label:"настроение",     desc:"выбери мud",             check: () => document.querySelector(".mood.active") !== null },
  { id:"secret_found",  emoji:"🥚", label:"пасхалка",       desc:"найди секрет",           check: () => secretPresses >= 6 },
  { id:"title_7",       emoji:"7️⃣", label:"×7",             desc:"7 раз на заголовок",     check: () => tapCount >= 7 || localStorage.getItem("found_title7") === "1" },
  { id:"snake_5",       emoji:"🐍", label:"змейка ×5",      desc:"набери 5 в змейке",      check: () => sBest >= 5 },
  { id:"snake_20",      emoji:"🏆", label:"змейка ×20",     desc:"набери 20 в змейке",     check: () => sBest >= 20 },
  { id:"react_300",     emoji:"⚡", label:"рефлексы",       desc:"реакция < 300мс",        check: () => parseInt(localStorage.getItem("react_best")||9999) < 300 },
  { id:"energy_max",    emoji:"💥", label:"макс. энергия",  desc:"набери 100% энергии",    check: () => energyVal >= 100 },
];

let unlockedAchieves = JSON.parse(localStorage.getItem("achievements") || "[]");

function renderAchieves() {
  const grid = document.getElementById("achieve-grid");
  grid.innerHTML = "";
  allAchieves.forEach(a => {
    const unlocked = unlockedAchieves.includes(a.id) || a.check();
    if (unlocked && !unlockedAchieves.includes(a.id)) {
      unlockedAchieves.push(a.id);
      localStorage.setItem("achievements", JSON.stringify(unlockedAchieves));
    }
    const el = document.createElement("div");
    el.className = "achieve-item" + (unlocked ? " unlocked" : " locked");
    el.title = a.desc;
    el.innerHTML = `<span class="a-emoji">${unlocked ? a.emoji : "🔒"}</span><span class="a-label">${unlocked ? a.label : "???"}</span>`;
    if (unlocked) {
      el.addEventListener("click", () => showToast(`${a.emoji} ${a.label}: ${a.desc}`));
    }
    grid.appendChild(el);
  });
  const cnt = unlockedAchieves.length;
  const total = allAchieves.length;
  const pct = Math.round(cnt/total*100);
  document.querySelector(".achieve-widget .widget-label").textContent = `ачивки ${cnt}/${total}`;
}

function checkAchieves() {
  const before = unlockedAchieves.length;
  renderAchieves();
  if (unlockedAchieves.length > before) {
    const newA = allAchieves.find(a => unlockedAchieves.includes(a.id) && !allAchieves.slice(0, before).map(x=>x.id).includes(a.id));
    const justUnlocked = allAchieves.filter(a => unlockedAchieves.includes(a.id)).slice(before);
    if (justUnlocked.length) showToast(`🏅 ачивка: ${justUnlocked[0].label}`, 3000);
  }
}

renderAchieves();
setInterval(checkAchieves, 2000);

// ===================== ENERGY WIDGET =====================
let energyVal = parseInt(localStorage.getItem("energy") || "42");

const energyBar   = document.getElementById("energy-bar");
const energyLabel = document.getElementById("energy-label");

const energyTexts = [
  [0,  "💀 мертво"],
  [15, "😵 почти труп"],
  [30, "😴 сонный режим"],
  [50, "😐 так себе"],
  [70, "😏 неплохо"],
  [85, "🔥 в ударе"],
  [100,"💥 МАКСИМУМ"]
];

function getEnergyText(v) {
  for (let i = energyTexts.length-1; i >= 0; i--) {
    if (v >= energyTexts[i][0]) return energyTexts[i][1];
  }
  return energyTexts[0][1];
}

function updateEnergy(delta) {
  energyVal = Math.max(0, Math.min(100, energyVal + delta));
  localStorage.setItem("energy", energyVal);
  energyBar.style.width = energyVal + "%";
  energyBar.style.background = energyVal > 70
    ? "linear-gradient(90deg,#6a5cff,#00d4ff)"
    : energyVal > 40
    ? "linear-gradient(90deg,#f7971e,#ffd200)"
    : "linear-gradient(90deg,#f00,#ff4fd8)";
  energyLabel.textContent = getEnergyText(energyVal);
  checkAchieves();
}
updateEnergy(0);

document.getElementById("e-coffee").addEventListener("click", () => { updateEnergy(+15); showToast("☕ +15 энергии"); bumpEl(energyBar); });
document.getElementById("e-sleep").addEventListener("click",  () => { updateEnergy(-20); showToast("😴 -20 энергии... спишь?"); });
document.getElementById("e-music").addEventListener("click",  () => { updateEnergy(+10); showToast("🎧 +10 энергии"); bumpEl(energyBar); });
document.getElementById("e-chaos").addEventListener("click",  () => {
  const d = Math.random() > 0.5 ? Math.floor(Math.random()*40)+10 : -(Math.floor(Math.random()*40)+10);
  updateEnergy(d);
  showToast(d > 0 ? `💀 хаос дал +${d}` : `💀 хаос забрал ${Math.abs(d)}`);
  if (d > 30) confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
});

// drain energy slowly
setInterval(() => { if (energyVal > 0) updateEnergy(-1); }, 30000);

// ===================== REACTION TEST =====================
const reactArea  = document.getElementById("react-area");
const reactMsg   = document.getElementById("react-msg");
const reactStart = document.getElementById("react-start");
const reactBest  = document.getElementById("react-best");

let reactState  = "idle"; // idle | waiting | ready | done
let reactTimer  = null;
let reactStart_ = 0;
let rBest = parseInt(localStorage.getItem("react_best") || "9999");
if (rBest < 9999) reactBest.textContent = rBest + " мс";

function resetReact() {
  reactState = "idle";
  reactArea.style.background = "";
  reactMsg.textContent = "жми старт";
  reactStart.textContent = "старт";
  clearTimeout(reactTimer);
}

reactStart.addEventListener("click", () => {
  if (reactState === "idle") {
    reactState = "waiting";
    reactArea.style.background = "rgba(255,0,0,0.15)";
    reactMsg.textContent = "жди...";
    reactStart.textContent = "отмена";
    const delay = 1500 + Math.random() * 3000;
    reactTimer = setTimeout(() => {
      reactState = "ready";
      reactArea.style.background = "rgba(0,212,255,0.25)";
      reactMsg.textContent = "ЖМИ!";
      reactStart_ = Date.now();
    }, delay);
  } else if (reactState === "waiting") {
    showToast("слишком рано 🐌");
    resetReact();
  } else if (reactState === "ready") {
    const ms = Date.now() - reactStart_;
    reactState = "done";
    reactArea.style.background = "rgba(106,92,255,0.2)";
    if (ms < rBest) {
      rBest = ms;
      localStorage.setItem("react_best", rBest);
      reactBest.textContent = rBest + " мс";
      showToast(`⚡ рекорд! ${ms} мс`, 3000);
      if (ms < 300) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      }
      checkAchieves();
    }
    const grade = ms < 200 ? "🤖 робот" : ms < 300 ? "⚡ молния" : ms < 400 ? "👍 неплохо" : ms < 600 ? "😐 средне" : "🐢 черепаха";
    reactMsg.textContent = `${ms} мс ${grade}`;
    reactStart.textContent = "ещё раз";
    setTimeout(resetReact, 2000);
  } else if (reactState === "done") {
    resetReact();
  }
});

reactArea.addEventListener("click", () => {
  if (reactState === "waiting") {
    showToast("слишком рано 🐌");
    resetReact();
  } else if (reactState === "ready") {
    reactStart.click();
  }
});
