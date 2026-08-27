/* ==========================================================================
   RAKSHA BANDHAN — SHREYA
   ========================================================================== */

const CONFIG = {
  sisterName: "Shreya",
  brotherName: "Dane",
  musicPath: "assets/music/raksha-bandhan.mp3"
};

/* ---------------------------------------------------------------------- */
/* Environment detection                                                  */
/* ---------------------------------------------------------------------- */
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const IS_TOUCH = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const IS_FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function getPerfTier(){
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const w = window.innerWidth;
  if (REDUCED_MOTION) return "low";
  if (w < 560 || cores <= 4 || mem <= 3) return "medium";
  if (w < 900) return "medium";
  return "high";
}
const PERF = getPerfTier();
const PARTICLE_COUNTS = { low: 22, medium: 55, high: 130 };
const AMBIENT_COUNT = PARTICLE_COUNTS[PERF];

if (IS_FINE_POINTER) document.body.classList.add("has-fine-pointer");

/* ---------------------------------------------------------------------- */
/* Ambient particle canvas (background, whole site)                       */
/* ---------------------------------------------------------------------- */
(function ambientParticles(){
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];

  function resize(){
    w = canvas.width = window.innerWidth * (window.devicePixelRatio > 1.5 ? 1.5 : 1);
    h = canvas.height = window.innerHeight * (window.devicePixelRatio > 1.5 ? 1.5 : 1);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }
  resize();
  window.addEventListener("resize", resize);

  function makeParticle(){
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2
    };
  }
  for (let i = 0; i < AMBIENT_COUNT; i++) particles.push(makeParticle());

  function tick(){
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f3d68a";
    particles.forEach(p => {
      p.pulse += 0.02;
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!REDUCED_MOTION) requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------------------------------------------------------------------- */
/* Custom cursor (desktop / fine pointer only)                            */
/* ---------------------------------------------------------------------- */
if (IS_FINE_POINTER && !REDUCED_MOTION) {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px"; dot.style.top = my + "px";
  });
  function raf(){
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(raf);
  }
  raf();
  document.addEventListener("mouseover", e => {
    if (e.target.closest("button, a, .rakhi, .envelope, .bond-card")) {
      ring.classList.add("is-active");
    }
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest("button, a, .rakhi, .envelope, .bond-card")) {
      ring.classList.remove("is-active");
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Intro sequence                                                         */
/* ---------------------------------------------------------------------- */
(function intro(){
  const introEl = document.getElementById("intro");
  const particlesWrap = document.getElementById("introParticles");
  const lines = Array.from(document.querySelectorAll(".intro__line"));
  const openBtn = document.getElementById("openGiftBtn");

  // sparkle particles rising in the intro
  const sparkCount = PERF === "high" ? 60 : PERF === "medium" ? 34 : 14;
  for (let i = 0; i < sparkCount; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = 40 + Math.random() * 50 + "%";
    s.style.animationDelay = (Math.random() * 3) + "s";
    s.style.animationDuration = (3 + Math.random() * 3) + "s";
    particlesWrap.appendChild(s);
  }

  const timeline = REDUCED_MOTION ? [0, 100, 200, 300] : [600, 2000, 3400, 4800];

  lines.forEach((line, i) => {
    setTimeout(() => {
      lines.forEach(l => l.style.opacity = 0);
      if (window.gsap) {
        gsap.fromTo(line, { opacity: 0, y: 14, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" });
      } else {
        line.style.opacity = 1;
      }
    }, timeline[i]);
  });

  setTimeout(() => {
    openBtn.classList.add("is-visible");
  }, timeline[3] + 1400);

  openBtn.addEventListener("click", openGift, { once: true });
})();

/* ---------------------------------------------------------------------- */
/* Open gift → burst transition → reveal main site                        */
/* ---------------------------------------------------------------------- */
function openGift(){
  const introEl = document.getElementById("intro");
  const burst = document.getElementById("burstOverlay");
  const main = document.getElementById("main");

  spawnPetalBurst();
  spawnConfettiBurst();

  if (window.gsap) {
    gsap.to(burst, { opacity: 1, scale: 1.4, duration: 0.9, ease: "power2.out" });
    gsap.to(burst, { opacity: 0, delay: 0.9, duration: 0.8, onComplete: () => burst.style.transform = "scale(.2)" });
  } else {
    burst.style.opacity = 1;
    setTimeout(() => burst.style.opacity = 0, 900);
  }

  setTimeout(() => {
    introEl.classList.add("is-hidden");
    main.hidden = false;
    document.body.style.overflow = "auto";
    initMainAnimations();
    tryStartMusic();
  }, 550);
}

/* ---------------------------------------------------------------------- */
/* Falling petals / confetti burst (DOM-based, short-lived)                */
/* ---------------------------------------------------------------------- */
function spawnPetalBurst(){
  const count = PERF === "high" ? 60 : PERF === "medium" ? 34 : 14;
  const colors = ["#e8a6b8", "#f3d68a", "#d4af5a", "#c0122c"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    const size = 10 + Math.random() * 14;
    Object.assign(p.style, {
      position: "fixed", top: "-5%", left: Math.random() * 100 + "vw",
      width: size + "px", height: size * 0.8 + "px",
      background: colors[i % colors.length],
      borderRadius: "60% 0 60% 0",
      opacity: "0.9", zIndex: 96, pointerEvents: "none",
      transform: `rotate(${Math.random()*360}deg)`
    });
    document.body.appendChild(p);
    const duration = 2600 + Math.random() * 2200;
    const drift = (Math.random() - 0.5) * 200;
    if (window.gsap) {
      gsap.to(p, { y: window.innerHeight + 100, x: drift, rotation: `+=${360 + Math.random()*360}`, duration: duration/1000, ease: "power1.in", onComplete: () => p.remove() });
    } else {
      p.style.transition = `transform ${duration}ms linear`;
      requestAnimationFrame(() => p.style.transform += ` translateY(${window.innerHeight+100}px)`);
      setTimeout(() => p.remove(), duration);
    }
  }
}

function spawnConfettiBurst(){
  const count = PERF === "high" ? 90 : PERF === "medium" ? 50 : 18;
  const colors = ["#f3d68a", "#d4af5a", "#fff3d6", "#e8a6b8", "#ffffff"];
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    const size = 5 + Math.random() * 6;
    Object.assign(c.style, {
      position: "fixed", top: cy + "px", left: cx + "px",
      width: size + "px", height: size + "px",
      background: colors[i % colors.length],
      opacity: "1", zIndex: 97, pointerEvents: "none",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px"
    });
    document.body.appendChild(c);
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * (window.innerWidth * 0.45);
    const dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist - 80;
    if (window.gsap) {
      gsap.to(c, { x: dx, y: dy + 260, opacity: 0, rotation: Math.random()*720, duration: 1.6 + Math.random(), ease: "power2.out", onComplete: () => c.remove() });
    } else {
      setTimeout(() => c.remove(), 1800);
    }
  }
}

/* ---------------------------------------------------------------------- */
/* Main site animations (scroll reveals, rakhi, cards, etc.)              */
/* ---------------------------------------------------------------------- */
let mainInitialized = false;
function initMainAnimations(){
  if (mainInitialized) return;
  mainInitialized = true;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  animateHeroReveal();
  buildRakhiDetails();
  initRakhiInteraction();
  initScrollReveals();
  initEnvelope();
  initQuiz();
  initPromiseThread();
  initFinalSurprise();
}

function animateHeroReveal(){
  const lines = document.querySelectorAll(".hero .reveal-line");
  if (window.gsap) {
    gsap.fromTo(lines, { opacity: 0, y: 26, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.18, ease: "power3.out", delay: 0.2 });
  } else {
    lines.forEach(l => l.style.opacity = 1);
  }
}

/* Rakhi: generate petals + pearls dynamically around the SVG */
function buildRakhiDetails(){
  const petalGroup = document.getElementById("petalGroup");
  const pearlGroup = document.getElementById("pearlGroup");
  const cx = 150, cy = 150, r1 = 78, r2 = 95;
  const petalCount = 10, pearlCount = 14;

  for (let i = 0; i < petalCount; i++) {
    const a = (i / petalCount) * Math.PI * 2;
    const x = cx + Math.cos(a) * r1, y = cy + Math.sin(a) * r1;
    const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    el.setAttribute("cx", x); el.setAttribute("cy", y); el.setAttribute("r", 6);
    el.setAttribute("fill", "url(#goldGrad)");
    el.setAttribute("opacity", "0.85");
    petalGroup.appendChild(el);
  }
  for (let i = 0; i < pearlCount; i++) {
    const a = (i / pearlCount) * Math.PI * 2 + 0.15;
    const x = cx + Math.cos(a) * r2, y = cy + Math.sin(a) * r2;
    const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    el.setAttribute("cx", x); el.setAttribute("cy", y); el.setAttribute("r", 3);
    el.setAttribute("fill", "#fff6df");
    el.setAttribute("opacity", "0.9");
    pearlGroup.appendChild(el);
  }
}

function initRakhiInteraction(){
  const rakhi = document.getElementById("rakhi");
  const sparkWrap = document.getElementById("rakhiSparkles");
  const stage = document.getElementById("rakhiStage");

  function burstSparkles(){
    const n = PERF === "low" ? 6 : 12;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      s.style.left = "50%"; s.style.top = "50%";
      sparkWrap.appendChild(s);
      if (window.gsap) {
        gsap.fromTo(s, { opacity: 0, x: 0, y: 0, scale: 0.4 },
          { opacity: 1, x: Math.cos(angle)*dist, y: Math.sin(angle)*dist, scale: 1, duration: 0.5, ease: "power2.out",
            onComplete: () => gsap.to(s, { opacity: 0, duration: 0.4, onComplete: () => s.remove() }) });
      } else {
        setTimeout(() => s.remove(), 900);
      }
    }
  }

  function activate(e){
    rakhi.classList.add("is-active");
    if (window.gsap) {
      gsap.to(rakhi, { rotateY: 12, rotateX: -6, scale: 1.05, duration: 0.4, ease: "power2.out" });
    }
    burstSparkles();
  }
  function release(){
    rakhi.classList.remove("is-active");
    if (window.gsap) gsap.to(rakhi, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "power3.out" });
  }

  stage.style.transformStyle = "preserve-3d";
  if (IS_FINE_POINTER) {
    rakhi.addEventListener("mouseenter", activate);
    rakhi.addEventListener("mouseleave", release);
    rakhi.addEventListener("mousemove", e => {
      const rect = rakhi.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (window.gsap) gsap.to(rakhi, { rotateY: px * 20, rotateX: -py * 20, duration: 0.3 });
    });
  } else {
    rakhi.addEventListener("touchstart", activate, { passive: true });
    rakhi.addEventListener("touchend", release);
  }
  rakhi.addEventListener("click", burstSparkles);
}

/* 3D tilt for cards on fine pointer devices */
function initTiltCards(){
  if (!IS_FINE_POINTER) return;
  document.querySelectorAll("[data-tilt]").forEach(card => {
    card.style.transformStyle = "preserve-3d";
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (window.gsap) gsap.to(card, { rotateY: px * 10, rotateX: -py * 10, duration: 0.4, ease: "power2.out" });
    });
    card.addEventListener("mouseleave", () => {
      if (window.gsap) gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
    });
  });
}

/* Generic scroll reveal using ScrollTrigger where available, IO fallback */
function initScrollReveals(){
  initTiltCards();

  if (window.gsap && window.ScrollTrigger) {
    document.querySelectorAll(".reveal-up").forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    gsap.utils.toArray(".bond-card").forEach((card, i) => {
      gsap.to(card, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: card, start: "top 90%" }
      });
    });
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.style.opacity = 1;
          ent.target.style.transform = "none";
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".reveal-up, .bond-card").forEach(el => io.observe(el));
  }
}

/* ---------------------------------------------------------------------- */
/* Envelope + letter                                                      */
/* ---------------------------------------------------------------------- */
function initEnvelope(){
  const envelope = document.getElementById("envelope");
  const paper = document.getElementById("letterPaper");
  let opened = false;

  function openEnvelope(){
    if (opened) return;
    opened = true;
    envelope.classList.add("is-open");

    const lines = paper.querySelectorAll(".letter-line");
    lines.forEach((line, i) => {
      setTimeout(() => {
        if (window.gsap) {
          gsap.to(line, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
        } else {
          line.style.opacity = 1; line.style.transform = "none";
        }
      }, 700 + i * 260);
    });
  }

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
  });
}

/* ---------------------------------------------------------------------- */
/* Quiz                                                                    */
/* ---------------------------------------------------------------------- */
function initQuiz(){
  const questions = Array.from(document.querySelectorAll(".quiz-question"));
  const progressFill = document.getElementById("quizProgressFill");
  const result = document.getElementById("quizResult");
  let current = 0;

  function goTo(index){
    questions[current].hidden = true;
    if (index >= questions.length) {
      result.hidden = false;
      progressFill.style.width = "100%";
      launchQuizCelebration();
      return;
    }
    current = index;
    questions[current].hidden = false;
    progressFill.style.width = Math.round((current / questions.length) * 100) + "%";
    if (window.gsap) {
      gsap.fromTo(questions[current], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }
  }

  questions.forEach((q, qi) => {
    q.querySelectorAll(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        q.querySelectorAll(".quiz-option").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        setTimeout(() => goTo(qi + 1), 420);
      });
    });
  });
}

function launchQuizCelebration(){
  const card = document.getElementById("quizCard");
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  spawnFloatingHearts(cx, cy);
  spawnConfettiFrom(cx, cy, PERF === "high" ? 70 : 36);
}

function spawnFloatingHearts(cx, cy){
  const n = PERF === "low" ? 6 : 14;
  for (let i = 0; i < n; i++) {
    const h = document.createElement("div");
    h.textContent = "❤";
    Object.assign(h.style, {
      position: "fixed", left: (cx + (Math.random()-0.5)*140) + "px", top: cy + "px",
      color: "#f3a6b8", fontSize: (14 + Math.random()*16) + "px",
      zIndex: 98, pointerEvents: "none", opacity: "0.9"
    });
    document.body.appendChild(h);
    if (window.gsap) {
      gsap.to(h, { y: -160 - Math.random()*120, x: (Math.random()-0.5)*80, opacity: 0, duration: 1.8 + Math.random(), ease: "power1.out", onComplete: () => h.remove() });
    } else {
      setTimeout(() => h.remove(), 1800);
    }
  }
}

function spawnConfettiFrom(cx, cy, count){
  const colors = ["#f3d68a", "#d4af5a", "#e8a6b8", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    const size = 5 + Math.random() * 6;
    Object.assign(c.style, {
      position: "fixed", top: cy + "px", left: cx + "px",
      width: size + "px", height: size + "px",
      background: colors[i % colors.length], zIndex: 98, pointerEvents: "none",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px"
    });
    document.body.appendChild(c);
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 220;
    if (window.gsap) {
      gsap.to(c, { x: Math.cos(angle)*dist, y: Math.sin(angle)*dist + 200, opacity: 0, rotation: Math.random()*720, duration: 1.4 + Math.random(), ease: "power2.out", onComplete: () => c.remove() });
    } else {
      setTimeout(() => c.remove(), 1600);
    }
  }
}

/* ---------------------------------------------------------------------- */
/* Promise thread draw                                                     */
/* ---------------------------------------------------------------------- */
function initPromiseThread(){
  const path = document.getElementById("promisePath");
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          path.classList.add("is-drawn");
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(path);
  } else {
    path.classList.add("is-drawn");
  }
}

/* ---------------------------------------------------------------------- */
/* Final surprise                                                          */
/* ---------------------------------------------------------------------- */
function initFinalSurprise(){
  const finalBtn = document.getElementById("finalBtn");

  // Reveal the button once the section scrolls into view (it uses the same
  // fade/glow-in treatment as the intro's "Open Your Gift" button).
  if (window.IntersectionObserver) {
    const btnObserver = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          finalBtn.classList.add("is-visible");
          btnObserver.unobserve(ent.target);
        }
      });
    }, { threshold: 0.4 });
    btnObserver.observe(finalBtn);
  } else {
    finalBtn.classList.add("is-visible");
  }

  const finalPre = document.getElementById("finalPre");
  const finalReveal = document.getElementById("finalReveal");
  const finalTextStack = document.getElementById("finalTextStack");
  const finalLines = Array.from(finalTextStack.querySelectorAll(".final-line"));
  const finalBig = document.getElementById("finalBig");
  const bgMusic = document.getElementById("bgMusic");

  finalBtn.addEventListener("click", () => {
    if (window.gsap) {
      gsap.to(finalPre, { opacity: 0, duration: 0.7, onComplete: () => finalPre.style.display = "none" });
    } else {
      finalPre.style.display = "none";
    }
    finalReveal.hidden = false;

    if (bgMusic && !bgMusic.paused) {
      bgMusic.volume = 0.35;
    }

    const timing = REDUCED_MOTION ? [0, 100, 200, 300, 400] : [400, 1900, 3400, 5000, 6800];
    finalLines.forEach((line, i) => {
      setTimeout(() => {
        finalLines.forEach(l => l.style.opacity = 0);
        if (window.gsap) {
          gsap.fromTo(line, { opacity: 0, y: 14, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" });
        } else {
          line.style.opacity = 1;
        }
      }, timing[i]);
    });

    setTimeout(() => {
      finalTextStack.style.opacity = 0;
      finalTextStack.style.transition = "opacity .6s";
      finalBig.classList.add("is-visible");
      launchFinalCelebration();
      if (bgMusic) bgMusic.volume = 0.6;
    }, timing[4] + 1600);
  }, { once: true });
}

/* Massive celebration on a dedicated full-screen canvas: fireworks + confetti + petals */
function launchFinalCelebration(){
  const canvas = document.getElementById("celebrationCanvas");
  const ctx = canvas.getContext("2d");
  let w, h;
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  canvas.style.opacity = 1;

  const particles = [];
  const gravity = 0.05;
  const colors = ["#f3d68a", "#d4af5a", "#fff3d6", "#e8a6b8", "#ff8fa3", "#ffffff"];

  function spawnFirework(x, y){
    const n = PERF === "high" ? 60 : PERF === "medium" ? 36 : 16;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const speed = 2 + Math.random() * 3.5;
      particles.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 1, decay: 0.008 + Math.random() * 0.01,
        color: colors[Math.floor(Math.random()*colors.length)], size: 2 + Math.random()*2, type: "spark"
      });
    }
  }

  function spawnPetal(){
    particles.push({
      x: Math.random()*w, y: -20, vx: (Math.random()-0.5)*0.6, vy: 0.6 + Math.random()*0.8,
      rot: Math.random()*360, vrot: (Math.random()-0.5)*2,
      life: 1, decay: 0.0015, color: colors[Math.floor(Math.random()*colors.length)],
      size: 8 + Math.random()*8, type: "petal"
    });
  }

  let fireworkTimer = 0, petalTimer = 0, elapsed = 0;
  const totalDuration = REDUCED_MOTION ? 1500 : 7000;
  const maxParticles = PERF === "high" ? 900 : PERF === "medium" ? 450 : 160;

  function frame(dt){
    elapsed += dt;
    fireworkTimer += dt; petalTimer += dt;

    if (fireworkTimer > (PERF === "low" ? 700 : 380) && elapsed < totalDuration) {
      fireworkTimer = 0;
      spawnFirework(w * (0.2 + Math.random()*0.6), h * (0.2 + Math.random()*0.35));
    }
    if (petalTimer > (PERF === "low" ? 220 : 90) && elapsed < totalDuration + 3000) {
      petalTimer = 0;
      if (particles.length < maxParticles) spawnPetal();
    }

    ctx.clearRect(0, 0, w, h);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }

      if (p.type === "spark") {
        p.vy += gravity;
        p.x += p.vx; p.y += p.vy;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      } else {
        p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
        ctx.globalAlpha = Math.max(p.life, 0) * 0.85;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size*0.6, p.size, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        if (p.y > h + 30) p.life = 0;
      }
    }
    ctx.globalAlpha = 1;

    if (elapsed < totalDuration + 4000) {
      requestAnimationFrame(step);
    } else {
      canvas.style.transition = "opacity 1.5s";
      canvas.style.opacity = 0;
    }
  }
  let lastT = performance.now();
  function step(t){
    const dt = Math.min(t - lastT, 50);
    lastT = t;
    frame(dt);
  }
  requestAnimationFrame(step);

  if (!REDUCED_MOTION) {
    // sparkle burst around the heart/text for extra shimmer
    const heartEl = document.querySelector(".final-heart");
    if (heartEl) {
      const rect = heartEl.getBoundingClientRect();
      spawnFloatingHearts(rect.left + rect.width/2, rect.top);
    }
  }
}

/* ---------------------------------------------------------------------- */
/* Music widget                                                            */
/* ---------------------------------------------------------------------- */
(function musicWidget(){
  const widget = document.getElementById("musicWidget");
  const toggle = document.getElementById("musicToggle");
  const panel = document.getElementById("musicPanel");
  const playBtn = document.getElementById("musicPlay");
  const muteBtn = document.getElementById("musicMute");
  const audio = document.getElementById("bgMusic");
  audio.volume = 0.5;

  let panelOpen = false;

  toggle.addEventListener("click", () => {
    panelOpen = !panelOpen;
    widget.classList.toggle("is-open", panelOpen);
  });

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        widget.classList.add("is-playing");
        playBtn.textContent = "⏸ Pause";
      }).catch(() => { /* no audio file available yet — fail silently */ });
    } else {
      audio.pause();
      widget.classList.remove("is-playing");
      playBtn.textContent = "▶ Play";
    }
  });

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "🔈 Unmute" : "🔇 Mute";
  });

  document.addEventListener("click", e => {
    if (panelOpen && !widget.contains(e.target)) {
      panelOpen = false;
      widget.classList.remove("is-open");
    }
  });

  window._tryStartMusic = function(){
    audio.play().then(() => {
      widget.classList.add("is-playing");
      playBtn.textContent = "⏸ Pause";
    }).catch(() => {
      // Autoplay blocked or file missing — user can press play manually.
    });
  };
})();

function tryStartMusic(){
  if (window._tryStartMusic) window._tryStartMusic();
}
