const video = document.getElementById("video");
const bar = document.getElementById("bar");
const time = document.getElementById("time");
const btn = document.getElementById("btn");
const title = document.getElementById("title");
const phrase = document.getElementById("phrase");
const status = document.getElementById("status");

/* =======================
   ФРАЗЫ
======================= */
const phrases = [
    "Видео само себя не посмотрит 👀",
    "Перемотка запрещена системой 😏",
    "Добро пожаловать в режим просмотра",
    "Ничего подозрительного не происходит"
];

phrase.textContent = phrases[Math.floor(Math.random()*phrases.length)];

/* =======================
   СТАТУСЫ (новая приколюха)
======================= */
const statuses = [
    "Инициализация интерфейса...",
    "Загрузка видео...",
    "Проверка доступа...",
    "Система готова"
];

let i = 0;
const interval = setInterval(() => {
    status.textContent = statuses[i];
    i++;
    if (i >= statuses.length) clearInterval(interval);
}, 900);

/* =======================
   AUTOPLAY
======================= */
video.muted = true;
video.play().catch(()=>{});

/* =======================
   SAVE PROGRESS
======================= */
const saved = localStorage.getItem("videoTime");
if (saved) video.currentTime = saved;

let max = 0;

/* =======================
   TIME + PROGRESS
======================= */
video.addEventListener("timeupdate", () => {

    localStorage.setItem("videoTime", video.currentTime);

    if (video.currentTime > max) max = video.currentTime;

    const percent = (video.currentTime / video.duration) * 100;
    bar.style.width = percent + "%";

    const s = Math.floor(video.currentTime);
    time.textContent =
        `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

    if (percent > 90) {
        btn.classList.add("active");
    }
});

/* =======================
   ANTI-SEEK
======================= */
video.addEventListener("seeking", () => {
    if (video.currentTime > max + 1) {
        video.currentTime = max;
    }
});

/* =======================
   TAB BEHAVIOR
======================= */
document.addEventListener("visibilitychange", () => {
    title.textContent = document.hidden ? "Вернись 👀" : "Добро пожаловать";
});

/* =======================
   HOVER EFFECT (прикалюха)
======================= */
document.querySelector(".card").addEventListener("mouseenter", () => {
    document.body.style.filter = "hue-rotate(10deg)";
});

document.querySelector(".card").addEventListener("mouseleave", () => {
    document.body.style.filter = "none";
});

/* =======================
   KEY EASTER EGG
======================= */
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "k") {
        status.textContent = "🥚 Пасхалка активирована";
        alert("K → секрет найден 😎");
    }
});

/* =======================
   TITLE DOUBLE CLICK
======================= */
title.addEventListener("dblclick", () => {
    status.textContent = "Секретный режим включён";
    document.body.style.filter = "contrast(1.2)";
});

/* =======================
   PARTICLES
======================= */
for (let i = 0; i < 25; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = (5 + Math.random() * 10) + "s";
    p.style.opacity = Math.random();
    document.body.appendChild(p);
});

/* =======================
   END VIDEO + CONFETTI
======================= */
video.addEventListener("ended", () => {

    title.textContent = "Готово ✅";
    status.textContent = "Просмотр завершён";

    btn.classList.add("active");

    confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 }
    });

});
