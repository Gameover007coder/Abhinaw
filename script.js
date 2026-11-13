/* ===== EDIT THESE ===== */
const CFG = { NAME: "Abhinaw", FROM: "Ujjawal Singh" };
/* ====================== */
document.title = "Happy 18th Birthday, " + CFG.NAME + "! 🎂";
document.querySelectorAll("[data-name]").forEach(e => e.textContent = CFG.NAME);
document.querySelectorAll("[data-from]").forEach(e => e.textContent = CFG.FROM);

/* ══════════════════════════════════════════════════════════════
   PARTICLE CANVAS — hearts, stars & confetti in background
══════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let W, H, particles = [];

  function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }
  resize();
  addEventListener("resize", resize);

  const SHAPES = ["♥", "✦", "★", "🎂", "✿", "·"];
  const COLORS = ["#ffd700", "#ff6b9d", "#c084fc", "#67e8f9", "#ffffff"];

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: H + 20,
      vx: (Math.random() - .5) * .8,
      vy: -(Math.random() * 1.2 + .4),
      size: Math.random() * 18 + 8,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * .6 + .3,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - .5) * .03,
    };
  }

  for (let i = 0; i < 40; i++) {
    const p = mkParticle();
    p.y = Math.random() * H;
    particles.push(p);
  }

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);
    if (particles.length < 55 && Math.random() < .05) particles.push(mkParticle());
    particles.forEach((p, idx) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
      p.alpha -= .0008;
      if (p.y < -40 || p.alpha <= 0) { particles[idx] = mkParticle(); return; }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
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
   THREE.JS 3-D BACKGROUND (Safe init with graceful fallback)
══════════════════════════════════════════════════════════════ */
let R, S, C, world, items = [];
try {
  if (typeof THREE !== "undefined") {
    R = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 2));
    R.setSize(innerWidth, innerHeight);
    const bgEl = document.getElementById("bg");
    if (bgEl) bgEl.appendChild(R.domElement);

    S = new THREE.Scene();
    C = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, .1, 200);
    C.position.z = 30;

    function tex(w, h, draw) {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const x = c.getContext("2d"); draw(x, w, h);
      return new THREE.CanvasTexture(c);
    }
    function rr(w, h, r) {
      const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }

    const cardGeo = new THREE.ExtrudeGeometry(rr(5.5, 7.5, .9), { depth: .3, bevelEnabled: false });
    cardGeo.center();
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x1a0030, metalness: .6, roughness: .4, emissive: 0xffd700, emissiveIntensity: .08
    });

    const cardTextures = [
      tex(128, 160, (x, w, h) => {
        const g = x.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#2a0050"); g.addColorStop(1, "#0d0a1a");
        x.fillStyle = g; x.fillRect(0, 0, w, h);
        x.fillStyle = "#ffd700"; x.font = "bold 22px sans-serif"; x.textAlign = "center";
        x.fillText("🎂", w/2, 55);
        x.font = "bold 16px Impact,sans-serif";
        x.fillText("HAPPY 18TH", w/2, 90);
        x.fillStyle = "#ff6b9d"; x.font = "14px sans-serif";
        x.fillText("ABHINAW ♥", w/2, 115);
      }),
      tex(128, 160, (x, w, h) => {
        x.fillStyle = "#0d0a1a"; x.fillRect(0, 0, w, h);
        x.fillStyle = "#c084fc"; x.font = "30px sans-serif"; x.textAlign = "center";
        x.fillText("👑", w/2, 60);
        x.fillStyle = "#ffd700"; x.font = "bold 20px Impact,sans-serif";
        x.fillText("KING", w/2, 92);
        x.fillStyle = "#67e8f9"; x.font = "13px sans-serif";
        x.fillText("TURNING 18 !", w/2, 118);
      }),
      tex(128, 160, (x, w, h) => {
        const g = x.createRadialGradient(64, 80, 0, 64, 80, 80);
        g.addColorStop(0, "#3a0060"); g.addColorStop(1, "#0d0a1a");
        x.fillStyle = g; x.fillRect(0, 0, w, h);
        x.font = "28px sans-serif"; x.textAlign = "center";
        x.fillText("🎉", w/2, 55);
        x.fillStyle = "#ff6b9d"; x.font = "bold 15px Impact";
        x.fillText("CELEBRATE!", w/2, 90);
        x.fillStyle = "#ffd700"; x.font = "12px sans-serif";
        x.fillText("♥ ★ ♥ ★ ♥", w/2, 115);
      }),
    ];

    world = new THREE.Group();
    S.add(world);

    function place(g) {
      const sc = .5 + Math.random() * .5;
      g.scale.setScalar(sc);
      g.position.set((Math.random() - .5) * 70, (Math.random() - .5) * 46, (Math.random() - .5) * 40 - 10);
      g.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      g.userData = {
        b: g.position.clone(),
        ph: Math.random() * 6.28,
        sp: .25 + Math.random() * .4,
        amp: 1.5 + Math.random() * 3,
        rx: (Math.random() - .5) * .01,
        ry: (Math.random() - .5) * .015,
      };
      world.add(g);
      items.push(g);
    }

    for (let i = 0; i < 15; i++) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(cardGeo, cardMat));
      const sc = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 6.4),
        new THREE.MeshBasicMaterial({ map: cardTextures[i % 3] })
      );
      sc.position.z = .17;
      g.add(sc);
      place(g);
    }

    // Sparkle points
    const N = 500, pos = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i += 3) {
      pos[i] = (Math.random() - .5) * 130;
      pos[i + 1] = (Math.random() - .5) * 100;
      pos[i + 2] = (Math.random() - .5) * 70;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const sparkles = new THREE.Points(pg, new THREE.PointsMaterial({
      color: 0xffd700, size: .3, transparent: true, opacity: .9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    S.add(sparkles);

    // Lights
    S.add(new THREE.AmbientLight(0xffffff, .75));
    const L1 = new THREE.PointLight(0xffd700, 2.5, 100); L1.position.set(-20, 15, 15); S.add(L1);
    const L2 = new THREE.PointLight(0xff6b9d, 1.8, 100); L2.position.set(20, -10, 15); S.add(L2);

    // Mouse parallax
    const mouse = { x: 0, y: 0 }, look = { x: 0, y: 0 };
    addEventListener("mousemove", e => {
      mouse.x = (e.clientX / innerWidth - .5) * 2;
      mouse.y = (e.clientY / innerHeight - .5) * 2;
    });
    addEventListener("touchmove", e => {
      const t = e.touches[0];
      mouse.x = (t.clientX / innerWidth - .5) * 2;
      mouse.y = (t.clientY / innerHeight - .5) * 2;
    }, { passive: true });

    const clock = new THREE.Clock();
    (function loop() {
      requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      items.forEach(g => {
        const d = g.userData;
        g.position.x = d.b.x + Math.sin(t * d.sp + d.ph) * d.amp;
        g.position.y = d.b.y + Math.cos(t * d.sp * .9 + d.ph) * d.amp;
        g.rotation.x += d.rx; g.rotation.y += d.ry;
      });
      sparkles.rotation.y = t * .015;
      look.x += (mouse.x - look.x) * .05;
      look.y += (mouse.y - look.y) * .05;
      C.position.x = look.x * 4; C.position.y = -look.y * 3; C.lookAt(0, 0, 0);
      R.render(S, C);
    })();
    addEventListener("resize", () => {
      C.aspect = innerWidth / innerHeight;
      C.updateProjectionMatrix();
      R.setSize(innerWidth, innerHeight);
    });
  }
} catch (e) {
  console.warn("Three.js background not loaded:", e);
}

/* ══════════════════════════════════════════════════════════════
   AUDIO ENGINE (Safe init with synthesizer)
══════════════════════════════════════════════════════════════ */
let AC, master, mus, sfx, nbuf, lvl = 0, st = 0, nextT = 0;
const hz = n => 440 * 2 ** ((n - 69) / 12);
const SD = 60 / 110 / 4;
const BASS = [36, 0, 36, 0, 38, 0, 36, 0, 33, 0, 33, 0, 40, 0, 38, 0];
const MELODY = [72, 0, 74, 0, 76, 0, 72, 0, 69, 0, 71, 0, 72, 0, 71, 0];

function tone(t, f, d, type, v, out, slide) {
  if (!AC || !out) return;
  try {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + d + .02);
  } catch(e){}
}
function noise(t, d, v, f, type, out, f2) {
  if (!AC || !out || !nbuf) return;
  try {
    const s = AC.createBufferSource(), fl = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = nbuf; fl.type = type; fl.frequency.setValueAtTime(f, t);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    s.connect(fl); fl.connect(g); g.connect(out); s.start(t); s.stop(t + d);
  } catch(e){}
}
function initAudio() {
  if (AC) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    AC = new AudioCtx();
    master = AC.createGain(); master.gain.value = .65; master.connect(AC.destination);
    mus = AC.createGain(); mus.gain.value = .45; mus.connect(master);
    sfx = AC.createGain(); sfx.gain.value = .9; sfx.connect(master);
    nbuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
    const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    [48, 55, 60].forEach(n => {
      const o = AC.createOscillator(), lp = AC.createBiquadFilter(), g = AC.createGain();
      o.type = "sine"; o.frequency.value = hz(n);
      lp.frequency.value = 600; g.gain.value = .03;
      o.connect(lp); lp.connect(g); g.connect(mus); o.start();
    });
    nextT = AC.currentTime + .1;
    setInterval(() => {
      if (!AC) return;
      while (nextT < AC.currentTime + .15) { beat(st, nextT); nextT += SD; st = (st + 1) % 16; }
    }, 30);
  } catch(e){}
}
function beat(s, t) {
  if (!mus) return;
  if (lvl >= 1 && s % 4 === 0) tone(t, 120, .2, "sine", .6, mus, 35);
  if (lvl >= 1 && BASS[s]) tone(t, hz(BASS[s]), .22, "triangle", .14, mus);
  if (lvl >= 2 && s % 2) noise(t, .04, .07, 8000, "highpass", mus);
  if (lvl >= 2 && MELODY[s]) tone(t, hz(MELODY[s]), .12, "sine", .05, mus);
  if (lvl >= 3 && (s === 4 || s === 12)) noise(t, .14, .18, 1800, "bandpass", mus);
}
const ok = () => AC && AC.state === "running" && sfx;
const blip = () => { try { ok() && tone(AC.currentTime, 880, .06, "sine", .12, sfx, 1400); } catch(e){} };
const whoosh = () => { try { ok() && noise(AC.currentTime, .6, .3, 400, "bandpass", sfx, 4000); } catch(e){} };
const loot = () => {
  if (!ok()) return;
  try { [72, 76, 79, 83, 86].forEach((n, i) => tone(AC.currentTime + i * .065, hz(n), .2, "triangle", .18, sfx)); } catch(e){}
};
function victory() {
  if (!ok()) return;
  try {
    const t0 = AC.currentTime, B = .38;
    mus.gain.setTargetAtTime(.15, t0, .2);
    const song = [
      [60,.75],[60,.25],[62,1],[60,1],[65,1],[64,2],
      [60,.75],[60,.25],[62,1],[60,1],[67,1],[65,2],
      [60,.75],[60,.25],[72,1],[69,1],[65,1],[64,1],[62,2],
      [70,.75],[70,.25],[69,1],[65,1],[67,1],[65,2],
    ];
    let t = t0 + .5;
    song.forEach(([n, b]) => { tone(t, hz(n), b * B * .9, "triangle", .15, sfx); t += b * B; });
    mus.gain.setTargetAtTime(.45, t + .5, .6);
  } catch(e){}
}
function setLevel(n) { lvl = n; }
document.addEventListener("visibilitychange", () => {
  if (!AC) return;
  try { document.hidden ? AC.suspend() : AC.resume(); } catch(e){}
});

/* ══════════════════════════════════════════════════════════════
   PHOTO SLIDESHOW
══════════════════════════════════════════════════════════════ */
(function initSlideshow() {
  const slides = document.querySelectorAll(".slide");
  const dots   = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  let current = 0, autoTimer = null;

  function showSlide(idx, fromLeft = false) {
    if (!slides.length) return;
    slides[current].classList.remove("active");
    if (dots[current]) dots[current].classList.remove("active");
    current = (idx + slides.length) % slides.length;
    slides[current].classList.remove("from-left");
    if (fromLeft) slides[current].classList.add("from-left");
    void slides[current].offsetWidth;
    slides[current].classList.add("active");
    if (dots[current]) dots[current].classList.add("active");
    blip();
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => showSlide(current + 1), 5500);
  }

  if (prevBtn) prevBtn.addEventListener("click", () => { showSlide(current - 1, true); startAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { showSlide(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener("click", () => { showSlide(i, i < current); startAuto(); }));

  let touchStartX = 0;
  const wrapper = document.querySelector(".slideshow-wrapper");
  if (wrapper) {
    wrapper.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrapper.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? showSlide(current + 1) : showSlide(current - 1, true); startAuto(); }
    }, { passive: true });
  }

  window.startSlideshowAuto = startAuto;
  window.stopSlideshowAuto  = () => clearInterval(autoTimer);
})();

/* ══════════════════════════════════════════════════════════════
   FLOW & STEP CONTROLLER
══════════════════════════════════════════════════════════════ */
const steps = [...document.querySelectorAll("[data-step]")];
const bar = document.getElementById("bar");
const LEVELS  = [0, 1, 2, 3, 3, 3];
const MEMORY_STEP_IDX = 3;
let cur = -1, busy = false, typeT;

// Enable start button smoothly with animation
const ld = document.querySelector(".ld i"), go = document.getElementById("go");

function unlockStart() {
  if (!go || !go.disabled) return;
  if (ld) ld.style.width = "100%";
  go.disabled = false;
  go.textContent = "Open my Birthday Surprise 🎁";
}

if (typeof gsap !== "undefined" && ld) {
  gsap.to(ld, {
    width: "100%", duration: 1.8, ease: "power1.inOut",
    onComplete: unlockStart
  });
} else {
  unlockStart();
}
// Guaranteed fallback unlock in case GSAP stalls
setTimeout(unlockStart, 2200);

if (go) {
  go.onclick = () => {
    try {
      initAudio();
      if (AC && AC.state === "suspended") {
        AC.resume().catch(() => {});
      }
    } catch(e){}

    whoosh();
    const startSec = document.getElementById("start");
    if (typeof gsap !== "undefined") {
      gsap.to("#start", {
        opacity: 0, scale: .96, transformOrigin: "50% 50%", duration: .7, ease: "power2.in",
        onComplete: () => { if (startSec) startSec.hidden = true; }
      });
      if (C) gsap.fromTo(C.position, { z: 70 }, { z: 30, duration: 2.2, ease: "power3.out" });
    } else {
      if (startSec) startSec.hidden = true;
    }

    const hud = document.getElementById("hud");
    if (hud) hud.hidden = false;
    const stage = document.getElementById("stage");
    if (stage) stage.hidden = false;
    goTo(0);
  };
}

function typeText(el) {
  if (!el) return;
  clearInterval(typeT);
  const txt = el.dataset.text || "";
  let i = 0; el.textContent = ""; el.classList.add("caret");
  typeT = setInterval(() => {
    el.textContent = txt.slice(0, ++i);
    if (i % 4 === 0) blip();
    if (i >= txt.length) { clearInterval(typeT); el.classList.remove("caret"); }
  }, 26);
}

function goTo(i) {
  if (busy || i === cur || i < 0 || i >= steps.length) return;
  busy = true;
  setTimeout(() => { busy = false; }, 900); // safety fallback unlock
  const prev = cur; cur = i;
  setLevel(LEVELS[i] || 0);
  if (prev >= 0) whoosh();

  if (bar) bar.style.width = (i / (steps.length - 1)) * 100 + "%";
  if (world && typeof gsap !== "undefined") {
    gsap.to(world.rotation, { y: i * .4, duration: 2, ease: "power2.inOut" });
  }

  if (prev === MEMORY_STEP_IDX && window.stopSlideshowAuto) window.stopSlideshowAuto();

  const show = () => {
    const s = steps[i];
    s.style.visibility = "visible";
    s.classList.add("on");
    s.scrollTop = 0;

    if (typeof gsap !== "undefined") {
      gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: .45 });
      const p = s.querySelector(".panel");
      if (p) {
        gsap.fromTo(p,
          { y: 60, scale: .92 },
          { y: 0, scale: 1, duration: .7, ease: "back.out(1.4)" });
      }
    } else {
      s.style.opacity = "1";
    }

    const tp = s.querySelector("#typed");
    if (tp) setTimeout(() => typeText(tp), 500);
    if (i === MEMORY_STEP_IDX && window.startSlideshowAuto) setTimeout(() => window.startSlideshowAuto(), 700);
    if (i === steps.length - 1) setTimeout(() => { victory(); celebrate(); }, 700);
    busy = false;
  };

  if (prev >= 0 && steps[prev]) {
    if (typeof gsap !== "undefined") {
      gsap.to(steps[prev], {
        opacity: 0, y: -25, duration: .35,
        onComplete: () => {
          steps[prev].classList.remove("on");
          steps[prev].style.visibility = "hidden";
          steps[prev].style.transform = "none";
          show();
        }
      });
    } else {
      steps[prev].classList.remove("on");
      steps[prev].style.visibility = "hidden";
      show();
    }
  } else {
    show();
  }
}

document.querySelectorAll("[data-next]").forEach(b => {
  b.addEventListener("click", () => { blip(); goTo(cur + 1); });
});
addEventListener("keydown", e => {
  if (e.key === "ArrowRight") goTo(cur + 1);
  if (e.key === "ArrowLeft") goTo(cur - 1);
});
document.querySelectorAll(".flip").forEach(f => {
  const t = () => { f.classList.toggle("open"); loot(); };
  f.addEventListener("click", t);
  f.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } });
});

/* ══════════════════════════════════════════════════════════════
   FINALE CONFETTI
══════════════════════════════════════════════════════════════ */
let shapes = [];
try {
  if (typeof confetti !== "undefined" && confetti.shapeFromText) {
    shapes = ["🎂", "🎉", "🥳", "👑", "🎁", "⭐"].map(text => confetti.shapeFromText({ text, scalar: 2 }));
  }
} catch (e) {}

function celebrate() {
  if (typeof confetti === "undefined") return;
  const colors = ["#ffd700", "#ff6b9d", "#c084fc", "#67e8f9", "#ffffff", "#ff9900"];

  confetti({ particleCount: 120, spread: 100, origin: { x: .3, y: .6 }, colors });
  confetti({ particleCount: 120, spread: 100, origin: { x: .7, y: .6 }, colors });
  setTimeout(() => {
    confetti({ particleCount: 80, spread: 120, origin: { x: .5, y: .4 }, colors });
  }, 450);
  setTimeout(() => {
    confetti({ particleCount: 60, spread: 80, origin: { x: .15, y: .5 }, colors });
    confetti({ particleCount: 60, spread: 80, origin: { x: .85, y: .5 }, colors });
  }, 900);
  if (shapes.length) {
    setTimeout(() => {
      confetti({ particleCount: 40, spread: 130, origin: { y: .45 }, shapes, scalar: 2.2 });
    }, 300);
  }
  if (C && typeof gsap !== "undefined") {
    gsap.fromTo(C.position, { z: 30 }, { z: 20, duration: .6, yoyo: true, repeat: 1 });
  }
}

const celBtn = document.getElementById("celebrate");
if (celBtn) {
  celBtn.addEventListener("click", () => { victory(); celebrate(); });
}
