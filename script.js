const video       = document.getElementById("video");
const bar         = document.getElementById("bar");
const timeEl      = document.getElementById("time");
const title       = document.getElementById("title");
const phrase      = document.getElementById("phrase");
const card        = document.getElementById("card");
const footerHint  = document.getElementById("footer-hint");
const rippleCont  = document.getElementById("ripple-container");

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

video.muted = true;
video.play().catch(() => {});

const saved = localStorage.getItem("videoTime");
if (saved && parseFloat(saved) > 0) {
  video.currentTime = parseFloat(saved);
}

let maxReached = 0;
let tapCount = 0;
let titleTapTimer = null;
let shakeCount = 0;

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

  if (pct > 50 && pct < 51) {
    showToast("половина пути 🎯");
  }
});

video.addEventListener("seeking", () => {
  if (video.currentTime > maxReached + 1) {
    video.currentTime = maxReached;
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 500);
    showToast("перемотка заблокирована 🔒");
  }
});

video.addEventListener("ended", () => {
  title.textContent = "Готово ✅";
  localStorage.removeItem("videoTime");
  footerHint.textContent = "ты досмотрел до конца. уважаю.";
  confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
});

video.addEventListener("play", () => {
  card.classList.add("glowing");
});

video.addEventListener("pause", () => {
  card.classList.remove("glowing");
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

title.addEventListener("click", () => {
  tapCount++;
  clearTimeout(titleTapTimer);

  title.classList.add("spin");
  setTimeout(() => title.classList.remove("spin"), 500);

  if (tapCount === 3) {
    showToast("хм, интересно 🤔");
  } else if (tapCount === 5) {
    showToast("ты точно что-то ищешь 🔍");
  } else if (tapCount === 7) {
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
    if (dx < 0) {
      showToast("некуда идти →");
    } else {
      showToast("← тоже некуда");
    }
  }

  if (Math.abs(dy) > 120 && Math.abs(dx) < 40) {
    if (dy < 0) {
      shakeCount++;
      if (shakeCount >= 3) {
        shakeCount = 0;
        showToast("✨ тряска активирована");
        confetti({ particleCount: 40, spread: 100, origin: { y: 0.5 }, gravity: 0.3 });
      }
    }
  }
}, { passive: true });

document.addEventListener("touchstart", (e) => {
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  const r = document.createElement("div");
  r.className = "ripple";
  r.style.left = (x - 30) + "px";
  r.style.top  = (y - 30) + "px";
  r.style.width  = "60px";
  r.style.height = "60px";
  rippleCont.appendChild(r);
  setTimeout(() => r.remove(), 900);
}, { passive: true });

let longPressTimer = null;
document.addEventListener("touchstart", (e) => {
  longPressTimer = setTimeout(() => {
    showToast("долгое нажатие обнаружено 👁", 2500);
    navigator.vibrate && navigator.vibrate([50, 30, 50]);
  }, 800);
}, { passive: true });
document.addEventListener("touchend", () => clearTimeout(longPressTimer), { passive: true });
document.addEventListener("touchmove", () => clearTimeout(longPressTimer), { passive: true });
