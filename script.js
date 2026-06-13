const video = document.getElementById("video");
const bar = document.getElementById("bar");
const time = document.getElementById("time");
const btn = document.getElementById("btn");
const title = document.getElementById("title");
const phrase = document.getElementById("phrase");

/* случайная фраза */
const phrases = [
    "Видео само себя не посмотрит 👀",
    "Перемотка не разрешена 😏",
    "Смотри до конца",
    "Ничего подозрительного нет"
];

phrase.textContent = phrases[Math.floor(Math.random()*phrases.length)];

/* автозапуск */
video.muted = true;
video.autoplay = true;
video.playsInline = true;

video.play().catch(() => {});

/* восстановление прогресса */
const saved = localStorage.getItem("videoTime");
if (saved) video.currentTime = saved;

/* прогресс */
let max = 0;

video.addEventListener("timeupdate", () => {

    localStorage.setItem("videoTime", video.currentTime);

    if (video.currentTime > max) {
        max = video.currentTime;
    }

    const percent = (video.currentTime / video.duration) * 100;
    bar.style.width = percent + "%";

    const s = Math.floor(video.currentTime);
    time.textContent =
        `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

    if (percent > 95) {
        btn.classList.add("active");
    }
});

/* запрет перемотки */
video.addEventListener("seeking", () => {
    if (video.currentTime > max + 1) {
        video.currentTime = max;
    }
});

/* вкладка */
document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "Вернись 👀" : "Welcome";
});

/* пасхалка */
title.addEventListener("dblclick", () => {
    alert("🥚 Пасхалка найдена");
});

/* частицы */
for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = (5 + Math.random() * 10) + "s";
    p.style.opacity = Math.random();
    document.body.appendChild(p);
});

/* 🎉 КОНФЕТТИ ПОСЛЕ ВИДЕО */
video.addEventListener("ended", () => {

    title.textContent = "Готово ✅";
    btn.classList.add("active");

    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
    });

});
