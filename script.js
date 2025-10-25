document.addEventListener("DOMContentLoaded", () => {
  // For testing: countdown = 10 seconds
  const targetDate = new Date(Date.now() + 10000); // 🔹 change to real date later

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const afterSection = document.getElementById("after");
  const playMusicBtn = document.getElementById("play-music");
  const hbdAudio = document.getElementById("hbd-audio");
  const playHbdBtn = document.getElementById("play-hbd");
  const balloonsToggle = document.getElementById("balloons-toggle");
  const gifts = document.querySelectorAll(".gift");

  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const modalOk = document.getElementById("modal-ok");

  let countdownInterval;
  let afterShown = false;
  let musicPlaying = false;

  const giftMsgs = [
    "🎁 Your first gift is under the sofa!",
    "🎁 Second gift hides near the chair!",
    "🎁 Third one waits in the toy box!",
    "🎁 Fourth is behind the curtain!",
    "🎁 Fifth is in the kitchen drawer!",
    "🎁 Sixth is under your pillow!"
  ];

  function updateCountdown() {
    const now = new Date();
    let diff = targetDate - now;
    if (diff <= 0) {
      clearInterval(countdownInterval);
      showAfterSection();
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  countdownInterval = setInterval(updateCountdown, 250);
  updateCountdown();

  function showAfterSection() {
    if (afterShown) return;
    afterShown = true;
    afterSection.classList.remove("hidden");
  }

  // Music play/pause near counter
  playMusicBtn.addEventListener("click", () => {
    if (!musicPlaying) {
      hbdAudio.currentTime = 0;
      hbdAudio.play();
      playMusicBtn.textContent = "⏸ Stop Music";
      musicPlaying = true;
    } else {
      hbdAudio.pause();
      playMusicBtn.textContent = "▶ Start Music";
      musicPlaying = false;
    }
  });

  hbdAudio.addEventListener("ended", () => {
    playMusicBtn.textContent = "▶ Start Music";
    musicPlaying = false;
  });

  // Play Song Again (after countdown)
  playHbdBtn.addEventListener("click", () => {
    hbdAudio.currentTime = 0;
    hbdAudio.play();
  });

  // Gift modals
  gifts.forEach((g, i) => {
    g.addEventListener("click", () => {
      modalText.textContent = giftMsgs[i];
      modal.classList.remove("hidden");
    });
  });

  modalOk.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // Balloons
  let balloonTimer;
  let balloonsRunning = false;
  balloonsToggle.addEventListener("click", () => {
    if (!balloonsRunning) startBalloons();
    else stopBalloons();
  });

  function startBalloons() {
    balloonsRunning = true;
    balloonsToggle.textContent = "Stop Balloons";
    balloonTimer = setInterval(spawnBalloon, 600);
  }
  function stopBalloons() {
    balloonsRunning = false;
    balloonsToggle.textContent = "Start Balloons";
    clearInterval(balloonTimer);
    document.querySelectorAll(".balloon").forEach(b => b.remove());
  }

  function spawnBalloon() {
    const b = document.createElement("div");
    b.className = "balloon";
    const size = Math.random() * 30 + 40;
    b.style.width = `${size}px`;
    b.style.height = `${size * 1.3}px`;
    b.style.left = `${Math.random() * 100}%`;
    const colors = ["#00aaff", "#5bd7ff", "#79afff", "#a1e5ff"];
    const c = colors[Math.floor(Math.random() * colors.length)];
    b.style.background = `radial-gradient(circle at 35% 25%, ${c}, #007bff)`;
    const knot = document.createElement("div");
    knot.className = "knot";
    b.appendChild(knot);
    b.style.animationDuration = `${8 + Math.random() * 8}s`;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 18000);
  }
});
