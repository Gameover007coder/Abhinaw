/* ===================================================================
   HAPPY 18TH BIRTHDAY ABHINAW — INTERACTIVE ANIMATION & LOGIC
   Clean, modern, aesthetic milestone celebration
   Music is ALWAYS ON — starts on first user tap (required by browsers)
   =================================================================== */

// Configuration
const CFG = {
  NAME: "Abhinaw",
  FROM: "Ujjawal Singh",
  AGE: "18"
};

// Set dynamic names & titles
document.title = `Happy 18th Birthday, ${CFG.NAME}! ✨`;
document.querySelectorAll("[data-name]").forEach(el => el.textContent = CFG.NAME);
document.querySelectorAll("[data-from]").forEach(el => el.textContent = CFG.FROM);

/* ══════════════════════════════════════════════════════════════
   1. PARTICLES & FLOATING CELEBRATION DUST CANVAS
══════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const SHAPES = ["✦", "★", "•", "✨", "♥"];
  const COLORS = ["#ffe066", "#f59e0b", "#60a5fa", "#a78bfa", "#f43f5e", "#ffffff"];

  function createParticle(initial = false) {
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 15,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -(Math.random() * 0.9 + 0.3),
      size: Math.random() * 14 + 6,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.7 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    };
  }

  for (let i = 0; i < 45; i++) {
    particles.push(createParticle(true));
  }

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, width, height);

    if (particles.length < 50 && Math.random() < 0.08) {
      particles.push(createParticle(false));
    }

    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.0006;

      if (p.y < -30 || p.alpha <= 0) {
        particles[index] = createParticle(false);
        return;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = p.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.shape, 0, 0);
      ctx.restore();
    });
  }

  loop();
})();

/* ══════════════════════════════════════════════════════════════
   2. FULL MUSIC ENGINE — ALWAYS ON
   Pure Web Audio API synthesizer: no external MP3 files needed.
   Builds a rich, layered birthday soundtrack that loops forever.
   Works on both mobile & desktop (starts on first user tap).
══════════════════════════════════════════════════════════════ */
let audioCtx = null;
let masterGain = null;
let musicGain = null;  // Background music bus
let sfxGain = null;    // Sound effects bus
let musicStarted = false;
let bgDroneNodes = [];
let bgBeatInterval = null;

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

function initAudio() {
  if (audioCtx) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = new Ctx();

    // Master output
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(audioCtx.destination);

    // Music bus (looping background)
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.35;
    musicGain.connect(masterGain);

    // SFX bus (chimes, sparkles, etc.)
    sfxGain = audioCtx.createGain();
    sfxGain.gain.value = 0.65;
    sfxGain.connect(masterGain);

  } catch (e) {
    console.warn("Audio init:", e);
  }
}

function ensureAudioReady() {
  initAudio();
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  if (!musicStarted) {
    startBackgroundMusic();
    musicStarted = true;
  }
}

/* ─── Tone helpers ──────────────────────────────────────────── */
function playTone(time, freq, dur, type, vol, bus, slideFreq) {
  if (!audioCtx || !bus) return;
  try {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    if (slideFreq) osc.frequency.exponentialRampToValueAtTime(slideFreq, time + dur);
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(g);
    g.connect(bus);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  } catch (e) {}
}

function playChime(freq = 880, duration = 0.15, type = "sine") {
  if (!audioCtx || audioCtx.state !== "running") return;
  playTone(audioCtx.currentTime, freq, duration, type, 0.18, sfxGain, freq * 1.5);
}

function playSparkleSound() {
  if (!audioCtx) return;
  const notes = [72, 76, 79, 84, 88];
  notes.forEach((note, i) => {
    setTimeout(() => {
      playChime(midiToFreq(note), 0.2, "triangle");
    }, i * 60);
  });
}

function playBlowSound() {
  if (!audioCtx || audioCtx.state !== "running") return;
  try {
    const now = audioCtx.currentTime;
    const dur = 1.0;
    const bufSize = audioCtx.sampleRate * dur;
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.4));
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const flt = audioCtx.createBiquadFilter();
    flt.type = "bandpass";
    flt.frequency.setValueAtTime(500, now);
    flt.frequency.exponentialRampToValueAtTime(200, now + dur);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.4, now);
    g.gain.linearRampToValueAtTime(0.01, now + dur);
    src.connect(flt);
    flt.connect(g);
    g.connect(sfxGain);
    src.start(now);
    src.stop(now + dur);
  } catch (e) {}
}

/* ─── Birthday Melody (one-shot, plays over background) ───── */
function playBirthdayMelody() {
  ensureAudioReady();
  if (!audioCtx) return;

  // "Happy Birthday to You" – full song
  const melody = [
    [60, 0.75], [60, 0.25], [62, 1], [60, 1], [65, 1], [64, 2],
    [60, 0.75], [60, 0.25], [62, 1], [60, 1], [67, 1], [65, 2],
    [60, 0.75], [60, 0.25], [72, 1], [69, 1], [65, 1], [64, 1], [62, 1.8],
    [70, 0.75], [70, 0.25], [69, 1], [65, 1], [67, 1], [65, 2.5]
  ];

  const tempo = 0.36;
  let t = audioCtx.currentTime + 0.15;

  // Temporarily duck background music
  if (musicGain) {
    musicGain.gain.setTargetAtTime(0.12, t, 0.3);
  }

  melody.forEach(([midi, beats]) => {
    const dur = beats * tempo;
    const freq = midiToFreq(midi);

    // Lead voice (triangle – warm, clear)
    playTone(t, freq, dur * 0.92, "triangle", 0.2, sfxGain);

    // Soft harmony underneath (+5 semitones = major 3rd sometimes)
    if (Math.random() > 0.5) {
      playTone(t, freq * 0.75, dur * 0.8, "sine", 0.06, sfxGain);
    }

    t += dur;
  });

  // Restore background music volume after melody
  if (musicGain) {
    musicGain.gain.setTargetAtTime(0.35, t + 0.5, 0.6);
  }
}

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND MUSIC — Continuous Looping Birthday Ambience
   A layered synthesizer score:
     Layer 1: Warm pad drone (evolving chord tones)
     Layer 2: Gentle arpeggiated sparkle pattern
     Layer 3: Soft rhythmic pulse
   All loop indefinitely until the page closes.
═══════════════════════════════════════════════════════════════ */
function startBackgroundMusic() {
  if (!audioCtx || !musicGain) return;

  // ── Layer 1: Warm Pad Drone (C major 7 – dreamy, celebratory) ──
  const chordNotes = [48, 52, 55, 59, 64]; // C3, E3, G3, B3, E4
  chordNotes.forEach(midi => {
    try {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      const lp = audioCtx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.value = midiToFreq(midi);

      lp.type = "lowpass";
      lp.frequency.value = 800;
      lp.Q.value = 1;

      g.gain.value = 0.045;

      osc.connect(lp);
      lp.connect(g);
      g.connect(musicGain);
      osc.start();

      bgDroneNodes.push({ osc, gain: g, filter: lp });
    } catch (e) {}
  });

  // ── Layer 2: Gentle arpeggiated sparkle (looping pattern) ──
  const arpNotes = [72, 76, 79, 84, 79, 76, 72, 67, 72, 76, 79, 83, 84, 83, 79, 76];
  const arpBeat = 0.32;  // seconds per note
  let arpIdx = 0;

  function scheduleArpBatch() {
    if (!audioCtx || audioCtx.state !== "running") return;
    const now = audioCtx.currentTime;

    for (let i = 0; i < 8; i++) {
      const noteTime = now + i * arpBeat;
      const midi = arpNotes[arpIdx % arpNotes.length];
      const freq = midiToFreq(midi);

      playTone(noteTime, freq, arpBeat * 0.7, "sine", 0.04, musicGain);

      // Subtle octave shimmer
      if (arpIdx % 4 === 0) {
        playTone(noteTime, freq * 2, arpBeat * 0.4, "sine", 0.015, musicGain);
      }

      arpIdx++;
    }
  }

  // Schedule arp batches continuously
  scheduleArpBatch();
  setInterval(() => {
    if (audioCtx && audioCtx.state === "running") {
      scheduleArpBatch();
    }
  }, arpBeat * 8 * 1000 - 80);

  // ── Layer 3: Soft rhythmic pulse (heartbeat-like warmth) ──
  const pulseBeat = arpBeat * 4;  // One pulse every 4 arp notes
  let pulseStep = 0;

  const bassNotes = [36, 36, 40, 36, 36, 36, 40, 43]; // C2 pattern

  function schedulePulseBatch() {
    if (!audioCtx || audioCtx.state !== "running") return;
    const now = audioCtx.currentTime;

    for (let i = 0; i < 4; i++) {
      const t = now + i * pulseBeat;
      const midi = bassNotes[pulseStep % bassNotes.length];
      const freq = midiToFreq(midi);

      // Deep soft bass
      playTone(t, freq, pulseBeat * 0.6, "sine", 0.07, musicGain);

      // Kick-like thump
      playTone(t, 90, 0.12, "sine", 0.06, musicGain, 40);

      pulseStep++;
    }
  }

  schedulePulseBatch();
  setInterval(() => {
    if (audioCtx && audioCtx.state === "running") {
      schedulePulseBatch();
    }
  }, pulseBeat * 4 * 1000 - 80);

  // ── Layer 4: Dreamy chime every ~5 seconds ──
  function scheduleChimes() {
    if (!audioCtx || audioCtx.state === "running") {
      const chimeMelody = [84, 88, 91, 96];
      const now = audioCtx.currentTime;
      chimeMelody.forEach((midi, i) => {
        playTone(now + i * 0.12, midiToFreq(midi), 0.5, "sine", 0.02, musicGain);
      });
    }
  }

  setInterval(() => {
    if (audioCtx && audioCtx.state === "running") {
      scheduleChimes();
    }
  }, 5200);
}

/* Handle page visibility — pause/resume audio gracefully */
document.addEventListener("visibilitychange", () => {
  if (!audioCtx) return;
  try {
    if (document.hidden) {
      audioCtx.suspend();
    } else {
      audioCtx.resume();
    }
  } catch (e) {}
});

/* ══════════════════════════════════════════════════════════════
   3. STEP FLOW CONTROLLER & NAVIGATION
══════════════════════════════════════════════════════════════ */
const steps = Array.from(document.querySelectorAll(".story-step"));
const navDots = Array.from(document.querySelectorAll(".nav-dot"));
const progressBar = document.getElementById("progress-bar");
let currentStep = -1;

function goToStep(index) {
  if (index < 0 || index >= steps.length) return;
  ensureAudioReady();
  playChime(650, 0.1);

  // Hide previous step
  if (currentStep >= 0 && steps[currentStep]) {
    steps[currentStep].classList.remove("active");
  }

  currentStep = index;
  const targetStep = steps[currentStep];
  targetStep.classList.add("active");

  // Scroll smoothly to top of card if on mobile
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Update progress bar & nav dots
  if (progressBar) {
    const pct = (currentStep / (steps.length - 1)) * 100;
    progressBar.style.width = `${pct}%`;
  }

  navDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentStep);
  });

  // Step specific animations & music cues
  if (currentStep === 1) {
    triggerTypewriter();
  } else if (currentStep === 3) {
    startGalleryAuto();
  } else if (currentStep === 4) {
    stopGalleryAuto();
  } else if (currentStep === 5) {
    // Finale: play birthday melody over the background + confetti
    triggerConfettiBurst(true);
    setTimeout(() => {
      playBirthdayMelody();
    }, 600);
  }
}

// Nav dots click
navDots.forEach((dot, idx) => {
  dot.addEventListener("click", () => {
    goToStep(idx);
  });
});

// "Next" buttons on each step
document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => {
    goToStep(currentStep + 1);
  });
});

// Entrance screen trigger
const btnEnter = document.getElementById("btn-enter");
const screenStart = document.getElementById("screen-start");
const topNav = document.getElementById("top-nav");
const mainExperience = document.getElementById("main-experience");

if (btnEnter) {
  btnEnter.addEventListener("click", () => {
    // This is the first user gesture — unlock audio + start music
    ensureAudioReady();
    playSparkleSound();
    triggerConfettiBurst();

    // Play a welcoming birthday chime cascade
    setTimeout(() => {
      playBirthdayMelody();
    }, 400);

    screenStart.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    screenStart.style.opacity = "0";
    screenStart.style.transform = "scale(0.95)";

    setTimeout(() => {
      screenStart.hidden = true;
      topNav.hidden = false;
      mainExperience.hidden = false;
      goToStep(0);
    }, 500);
  });
}

// Restart Surprise
const btnRestart = document.getElementById("btn-restart");
if (btnRestart) {
  btnRestart.addEventListener("click", () => {
    goToStep(0);
  });
}

/* ══════════════════════════════════════════════════════════════
   4. TYPEWRITER EFFECT FOR HEARTFELT LETTER
══════════════════════════════════════════════════════════════ */
let typewriterDone = false;
function triggerTypewriter() {
  const el = document.getElementById("typewriter-text");
  if (!el || typewriterDone) return;
  const fullText = el.getAttribute("data-text") || "";
  el.textContent = "";
  el.classList.add("typing-cursor");

  let charIdx = 0;
  const interval = setInterval(() => {
    if (charIdx < fullText.length) {
      el.textContent += fullText[charIdx];
      charIdx++;
      if (charIdx % 6 === 0) playChime(950 + Math.random() * 200, 0.05);
    } else {
      clearInterval(interval);
      el.classList.remove("typing-cursor");
      typewriterDone = true;
    }
  }, 22);
}

/* ══════════════════════════════════════════════════════════════
   5. INTERACTIVE 3D FLIP CARDS
══════════════════════════════════════════════════════════════ */
document.querySelectorAll(".flip-card").forEach(card => {
  card.addEventListener("click", () => {
    ensureAudioReady();
    card.classList.toggle("flipped");
    playSparkleSound();
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.classList.toggle("flipped");
      playSparkleSound();
    }
  });
});

/* ══════════════════════════════════════════════════════════════
   6. PHOTO GALLERY & CAROUSEL (6 Images)
══════════════════════════════════════════════════════════════ */
const slides = Array.from(document.querySelectorAll(".carousel-slide"));
const thumbs = Array.from(document.querySelectorAll(".thumb-item"));
const prevBtn = document.getElementById("car-prev");
const nextBtn = document.getElementById("car-next");
let currentSlide = 0;
let galleryTimer = null;

function showSlide(index) {
  if (!slides.length) return;
  slides[currentSlide].classList.remove("active");
  thumbs[currentSlide]?.classList.remove("active");

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add("active");
  thumbs[currentSlide]?.classList.add("active");

  thumbs[currentSlide]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

function nextSlide() {
  showSlide(currentSlide + 1);
  playChime(750, 0.08);
}

function prevSlide() {
  showSlide(currentSlide - 1);
  playChime(750, 0.08);
}

if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetGalleryAuto(); });
if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetGalleryAuto(); });

thumbs.forEach((thumb, idx) => {
  thumb.addEventListener("click", () => {
    showSlide(idx);
    playChime(800, 0.08);
    resetGalleryAuto();
  });
});

// Touch Swipe on Carousel
let touchStartX = 0;
const carTrack = document.getElementById("car-track");
if (carTrack) {
  carTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carTrack.addEventListener("touchend", (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diffX) > 40) {
      diffX < 0 ? nextSlide() : prevSlide();
      resetGalleryAuto();
    }
  }, { passive: true });
}

function startGalleryAuto() {
  clearInterval(galleryTimer);
  galleryTimer = setInterval(nextSlide, 4500);
}

function stopGalleryAuto() {
  clearInterval(galleryTimer);
}

function resetGalleryAuto() {
  stopGalleryAuto();
  startGalleryAuto();
}

/* ══════════════════════════════════════════════════════════════
   7. PHOTO LIGHTBOX MODAL (Click to View Full Photo)
══════════════════════════════════════════════════════════════ */
const galleryData = [
  {
    src: "photo1.jpg",
    tag: "❤️ Memory 1 of 6",
    title: "The Million Dollar Smile",
    desc: "That radiant smile and unmatched energy that brightens up every single room. Always stay this joyful, brother!"
  },
  {
    src: "photo2.jpg",
    tag: "⭐ Memory 2 of 6",
    title: "Brothers Side by Side",
    desc: "Through every laugh, every adventure, and every milestone — no bond in this world is stronger than ours."
  },
  {
    src: "photo3.jpg",
    tag: "🌟 Memory 3 of 6",
    title: "Unbreakable Loyalty",
    desc: "A brotherhood built on absolute trust and memories that time will never erase. Always standing right by you."
  },
  {
    src: "photo4.jpg",
    tag: "🔥 Memory 4 of 6",
    title: "Fearless & Passionate",
    desc: "Your drive, fire, and unstoppable spirit will take you to heights you haven't even dreamed of yet. Go get it!"
  },
  {
    src: "photo5.jpg",
    tag: "✨ Memory 5 of 6",
    title: "Golden Throwback Days",
    desc: "From the innocent little boy to a handsome 18-year-old young man — watching you grow is my greatest pride and joy."
  },
  {
    src: "photo6.jpg",
    tag: "👑 Memory 6 of 6",
    title: "Class, Swagger & The Future",
    desc: "Stepping into 18 looking sharp, confident, and ready to conquer adulthood. The entire world is waiting for your legacy!"
  }
];

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTag = document.getElementById("lightbox-tag");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-desc");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxBackdrop = document.getElementById("lightbox-backdrop");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxCounter = document.getElementById("lightbox-counter");

let lightboxIdx = 0;

function openLightbox(index) {
  if (!lightbox || index < 0 || index >= galleryData.length) return;
  lightboxIdx = index;
  const item = galleryData[lightboxIdx];

  if (lightboxImg) lightboxImg.src = item.src;
  if (lightboxTag) lightboxTag.textContent = item.tag;
  if (lightboxTitle) lightboxTitle.textContent = item.title;
  if (lightboxDesc) lightboxDesc.textContent = item.desc;
  if (lightboxCounter) lightboxCounter.textContent = `${lightboxIdx + 1} / ${galleryData.length}`;

  lightbox.hidden = false;
  stopGalleryAuto();
  playChime(920, 0.1);
}

function closeLightbox() {
  if (lightbox) {
    lightbox.hidden = true;
    showSlide(lightboxIdx);
    startGalleryAuto();
  }
}

function nextLightboxPhoto() {
  lightboxIdx = (lightboxIdx + 1) % galleryData.length;
  openLightbox(lightboxIdx);
}

function prevLightboxPhoto() {
  lightboxIdx = (lightboxIdx - 1 + galleryData.length) % galleryData.length;
  openLightbox(lightboxIdx);
}

// Click on polaroid frame or zoom badge to open full photo
document.querySelectorAll(".polaroid-frame").forEach(frame => {
  frame.addEventListener("click", () => {
    const idx = parseInt(frame.getAttribute("data-index") || "0", 10);
    openLightbox(idx);
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
if (lightboxNext) lightboxNext.addEventListener("click", nextLightboxPhoto);
if (lightboxPrev) lightboxPrev.addEventListener("click", prevLightboxPhoto);

/* ══════════════════════════════════════════════════════════════
   8. INTERACTIVE BIRTHDAY CAKE & WISH CEREMONY
══════════════════════════════════════════════════════════════ */
const btnBlow = document.getElementById("btn-blow-candles");
const candlesGroup = document.getElementById("candles-group");
const wishBanner = document.getElementById("wish-banner");
const btnAfterCake = document.getElementById("btn-after-cake");
const blowBtnText = document.getElementById("blow-btn-text");
let candlesBlown = false;

if (btnBlow) {
  btnBlow.addEventListener("click", () => {
    if (candlesBlown) return;
    candlesBlown = true;
    ensureAudioReady();

    // 1. Play blowing audio effect
    playBlowSound();

    // 2. Extinguish flames & trigger smoke
    candlesGroup.classList.add("candles-blown");
    blowBtnText.textContent = "Candles Blown! 🌟 Wish Sent!";
    btnBlow.style.pointerEvents = "none";
    btnBlow.style.opacity = "0.75";

    // 3. Show wish celebration after 0.6s
    setTimeout(() => {
      playSparkleSound();
      triggerConfettiBurst(true);
      if (wishBanner) wishBanner.hidden = false;
      if (btnAfterCake) btnAfterCake.hidden = false;
    }, 600);
  });
}

/* ══════════════════════════════════════════════════════════════
   9. CELEBRATION CONFETTI & FIREWORKS
══════════════════════════════════════════════════════════════ */
function triggerConfettiBurst(isMassive = false) {
  if (typeof confetti === "undefined") return;

  const count = isMassive ? 140 : 80;
  const colors = ["#ffe066", "#f59e0b", "#3b82f6", "#06b6d4", "#ec4899", "#ffffff"];

  confetti({
    particleCount: count,
    spread: 90,
    origin: { x: 0.5, y: 0.6 },
    colors: colors
  });

  if (isMassive) {
    setTimeout(() => {
      confetti({ particleCount: 70, spread: 100, origin: { x: 0.25, y: 0.5 }, colors });
      confetti({ particleCount: 70, spread: 100, origin: { x: 0.75, y: 0.5 }, colors });
    }, 300);

    setTimeout(() => {
      confetti({ particleCount: 60, spread: 120, origin: { x: 0.5, y: 0.35 }, colors });
    }, 600);
  }
}

// Finale Buttons
const btnShowerConfetti = document.getElementById("btn-shower-confetti");
if (btnShowerConfetti) {
  btnShowerConfetti.addEventListener("click", () => {
    playSparkleSound();
    triggerConfettiBurst(true);
  });
}

const btnBirthdayChime = document.getElementById("btn-birthday-chime");
if (btnBirthdayChime) {
  btnBirthdayChime.addEventListener("click", () => {
    playBirthdayMelody();
  });
}

const btnSparkleBurst = document.getElementById("btn-sparkle-burst");
if (btnSparkleBurst) {
  btnSparkleBurst.addEventListener("click", () => {
    playSparkleSound();
    triggerConfettiBurst(false);
  });
}

// Keyboard shortcuts for accessibility
window.addEventListener("keydown", (e) => {
  if (lightbox && !lightbox.hidden) {
    if (e.key === "ArrowRight") nextLightboxPhoto();
    else if (e.key === "ArrowLeft") prevLightboxPhoto();
    else if (e.key === "Escape") closeLightbox();
    return;
  }

  if (e.key === "ArrowRight") {
    if (currentStep >= 0 && currentStep < steps.length - 1) goToStep(currentStep + 1);
  } else if (e.key === "ArrowLeft") {
    if (currentStep > 0) goToStep(currentStep - 1);
  }
});
