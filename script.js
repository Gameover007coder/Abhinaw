/* ===== EDIT THESE ===== */
const CFG = { NAME: "Abhinaw", FROM: "Ujjawal Singh" };
/* ====================== */
document.title = "Happy Birthday, " + CFG.NAME + "!";
document.querySelectorAll("[data-name]").forEach(e => e.textContent = CFG.NAME);
document.querySelectorAll("[data-from]").forEach(e => e.textContent = CFG.FROM);

/* ---------- 3D BACKGROUND: phones, watches, zone ring, tracers ---------- */
const R = new THREE.WebGLRenderer({ antialias: true, alpha: true });
R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setSize(innerWidth, innerHeight);
document.getElementById("bg").appendChild(R.domElement);
const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, .1, 200);
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
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
const phoneGeo = new THREE.ExtrudeGeometry(rr(4.4, 9, .8), { depth: .5, bevelEnabled: false }); phoneGeo.center();
const watchGeo = new THREE.ExtrudeGeometry(rr(5, 5.6, 1.2), { depth: .8, bevelEnabled: false }); watchGeo.center();
const strapGeo = new THREE.BoxGeometry(3.4, 4, .4);
const body = new THREE.MeshStandardMaterial({ color: 0x1b1612, metalness: .8, roughness: .3, emissive: 0xff6a00, emissiveIntensity: .12 });
const strapMat = new THREE.MeshStandardMaterial({ color: 0xff6a00, roughness: .6 });

const phoneTex = [
  tex(128, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#ff6a00"); g.addColorStop(1, "#1b0a00");
    x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = "#fff"; x.font = "bold 30px Impact,sans-serif"; x.textAlign = "center";
    x.fillText("BOOYAH!", w / 2, 110); x.fillStyle = "#ffc21a"; x.fillRect(20, 150, 88, 8); x.fillRect(20, 170, 56, 8); }),
  tex(128, 256, (x, w, h) => { x.fillStyle = "#0b1218"; x.fillRect(0, 0, w, h); x.fillStyle = "#3de0ff"; x.font = "bold 38px monospace"; x.textAlign = "center";
    x.fillText("HBD", w / 2, 120); x.font = "40px sans-serif"; x.fillText("🎂", w / 2, 180); })
];
const clockTex = tex(128, 128, () => {});
function drawClock() {
  const c = clockTex.image.getContext("2d"), d = new Date();
  c.fillStyle = "#050a0d"; c.fillRect(0, 0, 128, 128); c.fillStyle = "#3de0ff"; c.font = "bold 44px monospace"; c.textAlign = "center";
  c.fillText(String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"), 64, 70);
  c.fillStyle = "#ffc21a"; c.font = "bold 20px monospace"; c.fillText("LVL UP", 64, 104); clockTex.needsUpdate = true;
}
drawClock(); setInterval(drawClock, 1000);
const hbdTex = tex(128, 128, (x, w, h) => { x.fillStyle = "#ff6a00"; x.fillRect(0, 0, w, h); x.fillStyle = "#fff"; x.font = "bold 40px Impact,sans-serif"; x.textAlign = "center"; x.fillText("HBD!", w / 2, 78); });

function screen(map, w, h, z) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map })); m.position.z = z; return m;
}
const world = new THREE.Group(); S.add(world);
const items = [];
function place(g, i) {
  const s = .55 + Math.random() * .6;
  g.scale.setScalar(s);
  g.position.set((Math.random() - .5) * 70, (Math.random() - .5) * 46, (Math.random() - .5) * 40 - 5);
  g.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
  g.userData = { b: g.position.clone(), ph: Math.random() * 6.28, sp: .3 + Math.random() * .5, amp: 1.5 + Math.random() * 3, rx: (Math.random() - .5) * .012, ry: (Math.random() - .5) * .018 };
  world.add(g); items.push(g);
}
for (let i = 0; i < 12; i++) {
  const g = new THREE.Group(); g.add(new THREE.Mesh(phoneGeo, body)); g.add(screen(phoneTex[i % 2], 3.9, 8.4, .26)); place(g, i);
}
for (let i = 0; i < 12; i++) {
  const g = new THREE.Group(); g.add(new THREE.Mesh(watchGeo, body)); g.add(screen(i % 3 ? clockTex : hbdTex, 4.2, 4.8, .41));
  [1, -1].forEach(d => { const st = new THREE.Mesh(strapGeo, strapMat); st.position.set(0, d * 4.6, -.1); g.add(st); }); place(g, i);
}

// safe-zone ring + embers + tracers
const ring = new THREE.Mesh(new THREE.RingGeometry(30, 30.5, 96), new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: .45, blending: THREE.AdditiveBlending }));
ring.position.z = -30; S.add(ring);
const N = 500, pos = new Float32Array(N * 3);
for (let i = 0; i < N * 3; i += 3) { pos[i] = (Math.random() - .5) * 120; pos[i + 1] = (Math.random() - .5) * 90; pos[i + 2] = (Math.random() - .5) * 70; }
const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
const embers = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffa040, size: .35, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false }));
S.add(embers);
const tracers = [];
for (let i = 0; i < 8; i++) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(10, .08), new THREE.MeshBasicMaterial({ color: 0xffc21a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
  m.userData = { t: Math.random(), sp: .3 + Math.random() * .4, y: (Math.random() - .5) * 50, z: -10 - Math.random() * 20 }; S.add(m); tracers.push(m);
}
S.add(new THREE.AmbientLight(0xffffff, .6));
const L1 = new THREE.PointLight(0xff6a00, 2, 100); L1.position.set(-20, 10, 15); S.add(L1);
const L2 = new THREE.PointLight(0x3de0ff, 1.2, 100); L2.position.set(20, -10, 15); S.add(L2);

const mouse = { x: 0, y: 0 }, look = { x: 0, y: 0 };
addEventListener("mousemove", e => { mouse.x = (e.clientX / innerWidth - .5) * 2; mouse.y = (e.clientY / innerHeight - .5) * 2; });
// touch support for 3D parallax
addEventListener("touchmove", e => {
  const t = e.touches[0];
  mouse.x = (t.clientX / innerWidth - .5) * 2;
  mouse.y = (t.clientY / innerHeight - .5) * 2;
}, { passive: true });
const clock = new THREE.Clock();
(function loop() {
  requestAnimationFrame(loop);
  const t = clock.getElapsedTime(), dt = clock.getDelta();
  items.forEach(g => { const d = g.userData;
    g.position.x = d.b.x + Math.sin(t * d.sp + d.ph) * d.amp; g.position.y = d.b.y + Math.cos(t * d.sp * .9 + d.ph) * d.amp;
    g.rotation.x += d.rx; g.rotation.y += d.ry; });
  tracers.forEach(m => { const d = m.userData; d.t += .016 * d.sp; if (d.t > 1) { d.t = 0; d.y = (Math.random() - .5) * 50; }
    m.position.set(-60 + d.t * 120, d.y + d.t * 8, d.z); m.rotation.z = .07; m.material.opacity = Math.sin(d.t * Math.PI) * .7; });
  ring.scale.setScalar(1 + Math.sin(t * .8) * .06); ring.rotation.z = t * .05;
  embers.rotation.y = t * .02; embers.position.y = (t * 1.5) % 6;
  look.x += (mouse.x - look.x) * .05; look.y += (mouse.y - look.y) * .05;
  C.position.x = look.x * 4; C.position.y = -look.y * 3; C.lookAt(0, 0, 0);
  R.render(S, C);
})();
addEventListener("resize", () => { C.aspect = innerWidth / innerHeight; C.updateProjectionMatrix(); R.setSize(innerWidth, innerHeight); });

/* ---------- SYNTH AUDIO (no files needed) ---------- */
let AC, master, mus, sfx, nbuf, lvl = 0, st = 0, nextT = 0, muted = false;
try { muted = localStorage.getItem("muted") === "1"; } catch (e) {}
const hz = n => 440 * 2 ** ((n - 69) / 12), SD = 60 / 118 / 4;
const BASS = [33,0,33,0,36,0,33,0,31,0,31,0,38,0,36,0], ARP = [69,0,72,0,76,0,72,0,67,0,71,0,74,0,71,0];

function tone(t, f, d, type, v, out, slide) {
  const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + d + .02);
}
function noise(t, d, v, f, type, out, f2) {
  const s = AC.createBufferSource(), fl = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = nbuf; fl.type = type; fl.frequency.setValueAtTime(f, t);
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
  s.connect(fl); fl.connect(g); g.connect(out); s.start(t); s.stop(t + d);
}
function initAudio() {
  if (AC) return; AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = muted ? 0 : .7; master.connect(AC.destination);
  mus = AC.createGain(); mus.gain.value = .55; mus.connect(master); sfx = AC.createGain(); sfx.gain.value = .9; sfx.connect(master);
  nbuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const w = AC.createBufferSource(), f = AC.createBiquadFilter(), wg = AC.createGain(); w.buffer = nbuf; w.loop = true; f.type = "bandpass"; f.frequency.value = 500;
  wg.gain.value = .06; w.connect(f); f.connect(wg); wg.connect(mus); w.start();
  [45, 52].forEach(n => { const o = AC.createOscillator(), lp = AC.createBiquadFilter(), g = AC.createGain(); o.type = "sawtooth"; o.frequency.value = hz(n);
    lp.frequency.value = 280; g.gain.value = .04; o.connect(lp); lp.connect(g); g.connect(mus); o.start(); });
  nextT = AC.currentTime + .1;
  setInterval(() => { while (nextT < AC.currentTime + .15) { beat(st, nextT); nextT += SD; st = (st + 1) % 16; } }, 30);
}
function beat(s, t) {
  if (lvl >= 1 && s % 4 === 0) tone(t, 150, .18, "sine", .7, mus, 40);
  if (lvl >= 1 && BASS[s]) tone(t, hz(BASS[s]), .2, "sawtooth", .16, mus);
  if (lvl >= 2 && s % 2) noise(t, .04, .1, 7000, "highpass", mus);
  if (lvl >= 2 && ARP[s]) tone(t, hz(ARP[s]), .1, "square", .045, mus);
  if (lvl >= 3 && (s === 4 || s === 12)) noise(t, .12, .22, 1600, "bandpass", mus);
}
const ok = () => AC && AC.state === "running";
const blip = () => ok() && tone(AC.currentTime, 700, .07, "square", .15, sfx, 1200);
const whoosh = () => ok() && noise(AC.currentTime, .7, .35, 300, "bandpass", sfx, 3500);
const loot = () => { if (!ok()) return; [72, 76, 79, 84].forEach((n, i) => tone(AC.currentTime + i * .07, hz(n), .18, "triangle", .2, sfx)); };
function victory() {
  if (!ok()) return; const t0 = AC.currentTime, B = .4; mus.gain.setTargetAtTime(.2, t0, .2);
  [60, 64, 67, 72].forEach((n, i) => tone(t0 + i * .1, hz(n), .5, "square", .14, sfx));
  const song = [[67,.75],[67,.25],[69,1],[67,1],[72,1],[71,2],[67,.75],[67,.25],[69,1],[67,1],[74,1],[72,2],
    [67,.75],[67,.25],[79,1],[76,1],[72,1],[71,1],[69,2],[77,.75],[77,.25],[76,1],[72,1],[74,1],[72,2]];
  let t = t0 + .9; song.forEach(([n, b]) => { tone(t, hz(n), b * B * .9, "square", .13, sfx); t += b * B; });
  mus.gain.setTargetAtTime(.55, t + .3, .5);
}
function setLevel(n) { lvl = n; }
const muteBtn = document.getElementById("mute");
if (muteBtn) {
  muteBtn.textContent = muted ? "🔇" : "🔊";
  muteBtn.onclick = () => {
    muted = !muted;
    muteBtn.textContent = muted ? "🔇" : "🔊";
    try { localStorage.setItem("muted", muted ? 1 : 0); } catch (e) {}
    if (master && AC) master.gain.setTargetAtTime(muted ? 0 : .7, AC.currentTime, .05);
  };
}
document.addEventListener("visibilitychange", () => { if (!AC) return; document.hidden ? AC.suspend() : AC.resume(); });

/* ---------- PHOTO SLIDESHOW LOGIC ---------- */
(function initSlideshow() {
  const slides    = document.querySelectorAll(".slide");
  const dots      = document.querySelectorAll(".dot");
  const prevBtn   = document.getElementById("slide-prev");
  const nextBtn   = document.getElementById("slide-next");
  let current     = 0;
  let autoTimer   = null;

  function showSlide(idx, fromLeft = false) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (idx + slides.length) % slides.length;
    slides[current].classList.remove("from-left");
    if (fromLeft) slides[current].classList.add("from-left");
    else slides[current].classList.remove("from-left");
    // force reflow for re-triggering animation
    void slides[current].offsetWidth;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    blip();
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => showSlide(current + 1), 5000);
  }

  prevBtn.addEventListener("click", () => { showSlide(current - 1, true); startAuto(); });
  nextBtn.addEventListener("click", () => { showSlide(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener("click", () => { showSlide(i, i < current); startAuto(); }));

  // Touch swipe support
  let touchStartX = 0;
  const wrapper = document.querySelector(".slideshow-wrapper");
  wrapper.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? showSlide(current + 1) : showSlide(current - 1, true); startAuto(); }
  }, { passive: true });

  // Start auto-play only when memory step is active (called from goTo)
  window.startSlideshowAuto = startAuto;
  window.stopSlideshowAuto  = () => clearInterval(autoTimer);
})();

/* ---------- FLOW: title -> steps -> finale ---------- */
const steps = [...document.querySelectorAll("[data-step]")], bar = document.getElementById("bar");
const aliveEl = document.querySelector("#alive b");
// ALIVE[i] corresponds to each step (0-5); 6 steps total now
const ALIVE  = [50, 31, 14, 8, 5, 1];
const LEVELS = [0,  1,  2,  3, 3, 3];
let cur = -1, busy = false, typeT;

const ld = document.querySelector(".ld i"), go = document.getElementById("go");
gsap.to(ld, { width: "100%", duration: 1.8, ease: "power1.inOut", onComplete: () => { go.disabled = false; go.textContent = "Tap to drop in"; } });

go.onclick = () => {
  initAudio(); if (AC.state === "suspended") AC.resume(); whoosh();
  gsap.to("#start", { opacity: 0, duration: .8, onComplete: () => document.getElementById("start").hidden = true });
  document.getElementById("hud").hidden = false; document.getElementById("stage").hidden = false;
  gsap.fromTo(C.position, { z: 60 }, { z: 30, duration: 2.4, ease: "power3.out" });
  goTo(0);
};

function typeText(el) {
  clearInterval(typeT); const txt = el.dataset.text; let i = 0; el.textContent = ""; el.classList.add("caret");
  typeT = setInterval(() => { el.textContent = txt.slice(0, ++i); if (i % 3 === 0) blip();
    if (i >= txt.length) { clearInterval(typeT); el.classList.remove("caret"); } }, 30);
}

// Index of the memory step among data-step sections
const MEMORY_STEP_IDX = 3;

function goTo(i) {
  if (busy || i === cur || i < 0 || i >= steps.length) return; busy = true;
  const prev = cur; cur = i; setLevel(LEVELS[i]); if (prev >= 0) whoosh();
  bar.style.width = (i / (steps.length - 1)) * 100 + "%";
  gsap.to({ v: +aliveEl.textContent }, { v: ALIVE[i], duration: 1, snap: { v: 1 }, onUpdate() { aliveEl.textContent = this.targets()[0].v; } });
  gsap.to(world.rotation, { y: i * .5, duration: 2, ease: "power2.inOut" });

  // Stop slideshow auto if leaving memory step
  if (prev === MEMORY_STEP_IDX && window.stopSlideshowAuto) window.stopSlideshowAuto();

  const show = () => {
    const s = steps[i]; gsap.set(s, { visibility: "visible" }); s.classList.add("on"); s.scrollTop = 0;
    gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: .4 });
    gsap.fromTo(s.querySelector(".panel"), { y: 60, scale: .94 }, { y: 0, scale: 1, duration: .7, ease: "back.out(1.4)" });
    const tp = s.querySelector("#typed"); if (tp) setTimeout(() => typeText(tp), 600);
    // Start slideshow auto when entering memory step
    if (i === MEMORY_STEP_IDX && window.startSlideshowAuto) setTimeout(() => window.startSlideshowAuto(), 800);
    if (i === steps.length - 1) setTimeout(() => { victory(); celebrate(); }, 700);
    busy = false;
  };
  if (prev >= 0) gsap.to(steps[prev], { opacity: 0, duration: .35, onComplete: () => { steps[prev].classList.remove("on"); gsap.set(steps[prev], { visibility: "hidden" }); show(); } });
  else show();
}
document.querySelectorAll("[data-next]").forEach(b => b.addEventListener("click", () => { blip(); goTo(cur + 1); }));
addEventListener("keydown", e => { if (e.key === "ArrowRight") goTo(cur + 1); if (e.key === "ArrowLeft") goTo(cur - 1); });
document.querySelectorAll(".flip").forEach(f => {
  const t = () => { f.classList.toggle("open"); loot(); };
  f.addEventListener("click", t); f.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } });
});

/* ---------- FINALE ---------- */
let shapes = [];
try { shapes = ["📱", "⌚", "💎"].map(text => confetti.shapeFromText({ text, scalar: 2 })); } catch (e) {}
function celebrate() {
  const colors = ["#ff6a00", "#ffc21a", "#3de0ff", "#ffffff"];
  confetti({ particleCount: 110, spread: 90, origin: { x: .3, y: .6 }, colors });
  confetti({ particleCount: 110, spread: 90, origin: { x: .7, y: .6 }, colors });
  if (shapes.length) confetti({ particleCount: 30, spread: 100, origin: { y: .5 }, shapes, scalar: 2 });
  gsap.fromTo(C.position, { z: 30 }, { z: 22, duration: .5, yoyo: true, repeat: 1 });
}
document.getElementById("celebrate").addEventListener("click", () => { victory(); celebrate(); });
