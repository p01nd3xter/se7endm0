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
