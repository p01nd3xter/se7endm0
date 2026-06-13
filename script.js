const video  = document.getElementById("video");
const bar    = document.getElementById("bar");
const time   = document.getElementById("time");
const title  = document.getElementById("title");
const phrase = document.getElementById("phrase");

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

video.muted = true;
video.play().catch(() => {});

const saved = localStorage.getItem("videoTime");
if (saved && parseFloat(saved) > 0) {
  video.currentTime = parseFloat(saved);
}

let maxReached = 0;

function fmt(sec) {
  const s = Math.floor(sec);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

video.addEventListener("timeupdate", () => {
  localStorage.setItem("videoTime", video.currentTime);

  if (video.currentTime > maxReached) {
    maxReached = video.currentTime;
  }

  const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
  bar.style.width = pct + "%";
  time.textContent = fmt(video.currentTime);
});

video.addEventListener("seeking", () => {
  if (video.currentTime > maxReached + 1) {
    video.currentTime = maxReached;
  }
});

video.addEventListener("ended", () => {
  title.textContent = "Готово ✅";
  localStorage.removeItem("videoTime");

  confetti({
    particleCount: 160,
    spread: 80,
    origin: { y: 0.6 }
  });
});

document.addEventListener("visibilitychange", () => {
  title.textContent = document.hidden ? "Вернись 👀" : "@se7endm0";
});

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "k") {
    title.textContent = "🥚 found";
    setTimeout(() => { title.textContent = "@se7endm0"; }, 2000);
  }
});
