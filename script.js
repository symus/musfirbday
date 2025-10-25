// script.js
// Put this in root next to index.html
document.addEventListener('DOMContentLoaded', () => {

  // ---- Countdown target: Oct 27 (start of day local time) of this year or next if already passed
  function getNextOct27() {
    const now = new Date();
    const year = now.getFullYear();
    const candidate = new Date(year, 9, 27, 0, 0, 0, 0); // month index: 9 = October
    if (now >= candidate) {
      return new Date(year + 1, 9, 27, 0, 0, 0, 0);
    }
    return candidate;
  }

  const targetDate = getNextOct27();

  // Elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const afterSection = document.getElementById('after');
  const countdownEl = document.getElementById('countdown');
  const playSynthBtn = document.getElementById('play-synth');
  const hbdAudio = document.getElementById('hbd-audio');
  const playHbdBtn = document.getElementById('play-hbd');
  const balloonsToggle = document.getElementById('balloons-toggle');

  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modal-text');
  const modalOk = document.getElementById('modal-ok');

  const gifts = document.querySelectorAll('.gift');

  // Gift messages (creative)
  const giftMsgs = [
    "Your first gift is under the sofa 🎁",
    "Your second gift is near the chair 🪑",
    "Your third gift is inside the toy box 🧸",
    "Your fourth gift is hidden behind the curtain 🌟",
    "Your fifth gift is in the kitchen drawer 🍪",
    "Your sixth gift is under the pillow 💫"
  ];

  // Ensure countdown displays decreasing order Days -> Hours -> Minutes -> Seconds
  function updateCountdown() {
    const now = new Date();
    let diff = Math.max(0, targetDate - now);

    // time calculations
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    daysEl.textContent = String(days).padStart(2,'0');
    hoursEl.textContent = String(hours).padStart(2,'0');
    minutesEl.textContent = String(minutes).padStart(2,'0');
    secondsEl.textContent = String(seconds).padStart(2,'0');

    // If countdown finished:
    if (new Date() >= targetDate) {
      onCountdownEnd();
      clearInterval(countdownInterval);
    }
  }

  let countdownInterval = setInterval(updateCountdown, 250);
  updateCountdown();

  // ---- After countdown ends behavior
  let afterShown = false;
  function onCountdownEnd() {
    if (afterShown) return;
    afterShown = true;

    // hide countdown card visually -- we keep it but hide the countdown and show message
    countdownEl.classList.add('hidden');
    playSynthBtn.classList.add('hidden');

    // reveal the after-section
    afterSection.classList.remove('hidden');

    // enable play button for hbd
    playHbdBtn.addEventListener('click', () => {
      // play hbd audio
      hbdAudio.currentTime = 0;
      hbdAudio.play().catch(()=>{ /* ignored: user must interact */ });
    });
  }

  // ---- modal for gifts
  gifts.forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.index, 10);
      const msg = giftMsgs[idx] || "What a surprise! Look around!";
      modalText.textContent = msg;
      modal.classList.remove('hidden');
    });
  });

  modalOk.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // close modal on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // ---- Balloons logic
  let balloonInterval = null;
  let balloonsRunning = false;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnBalloon() {
    const b = document.createElement('div');
    b.className = 'balloon';
    const size = rand(36, 72);
    b.style.width = `${size}px`;
    b.style.height = `${size * 1.3}px`;

    // random horizontal start
    const left = rand(5, 95);
    b.style.left = `${left}%`;

    // color
    const hues = [
      ['#ff6fb5', '#ffb86b'],
      ['#7ee7ff', '#9b7bff'],
      ['#ffd36b', '#ff9ac5'],
      ['#8aff9b', '#8bd3ff']
    ];
    const c = hues[Math.floor(rand(0, hues.length))];
    b.style.background = `radial-gradient(circle at 35% 30%, ${c[0]}, ${c[1]})`;
    b.style.border = '2px solid rgba(255,255,255,0.35)';
    b.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';

    // knot
    const knot = document.createElement('div');
    knot.className = 'knot';
    b.appendChild(knot);

    // animation duration varied
    const duration = rand(8, 18);
    b.style.animationDuration = `${duration}s`;
    b.style.animationTimingFunction = 'linear';

    // small horizontal bobbing by transform rotate applied by CSS keyframes (already rotates)

    document.body.appendChild(b);

    // remove after animation ends
    setTimeout(() => {
      if (b && b.parentElement) b.parentElement.removeChild(b);
    }, duration * 1000 + 200);
  }

  function startBalloons() {
    if (balloonsRunning) return;
    balloonsRunning = true;
    balloonsToggle.textContent = 'Stop Balloons';
    spawnBalloon(); // spawn one right away
    balloonInterval = setInterval(spawnBalloon, 700);
  }

  function stopBalloons() {
    balloonsRunning = false;
    balloonsToggle.textContent = 'Start Balloons';
    if (balloonInterval) {
      clearInterval(balloonInterval);
      balloonInterval = null;
    }
    // remove all existing balloons
    document.querySelectorAll('.balloon').forEach(b => b.remove());
  }

  balloonsToggle.addEventListener('click', () => {
    if (!afterShown) return; // protective
    if (balloonsRunning) stopBalloons();
    else startBalloons();
  });

  // ---- Synthesized small birthday jingle for play-synth
  // This avoids requiring a second audio file. Plays a short melody when user clicks.
  function playBirthdaySynth() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const notes = [
        // frequencies (a very short melody hinting HBD)
        523.25, 523.25, 587.33, 523.25, 698.46, 659.25,
        523.25, 523.25, 587.33, 523.25, 783.99, 698.46
      ];
      let t = ctx.currentTime + 0.05;
      notes.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(ctx.destination);
        // envelope
        g.gain.setTargetAtTime(0.12, t, 0.02);
        g.gain.setTargetAtTime(0.0001, t + 0.28, 0.05);
        o.start(t);
        o.stop(t + 0.35);
        t += 0.35;
      });
    } catch (e) {
      console.warn('AudioContext not available', e);
    }
  }

  playSynthBtn.addEventListener('click', () => {
    playBirthdaySynth();
  });

  // Accessibility: allow pressing Enter on gift cards
  gifts.forEach(g => {
    g.setAttribute('tabindex', '0');
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') g.click();
    });
  });

  // If user reloads and the date is already past we immediately call onCountdownEnd
  if (new Date() >= targetDate) {
    onCountdownEnd();
    clearInterval(countdownInterval);
  }

});
