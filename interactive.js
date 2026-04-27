
/* =============================================
   INTERACTIVE PORTFOLIO JS — Ardiansyah
   ============================================= */

// ─── 1. SCROLL PROGRESS BAR ────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100) + '%';
  });
}

// ─── 2. CUSTOM CURSOR + PARTICLE TRAIL ─────────
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    spawnParticle(mouseX, mouseY);
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .physics-item, input, [data-tilt]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

  // Particle trail
  let lastParticle = 0;
  const colors = ['#9CAF88', '#A9CCE3', '#c8e6c9', '#b3d9f5'];
  function spawnParticle(x, y) {
    const now = Date.now();
    if (now - lastParticle < 40) return;
    lastParticle = now;
    const p = document.createElement('div');
    p.className = 'cursor-particle';
    const size = Math.random() * 6 + 3;
    p.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

// ─── 3. TYPEWRITER EFFECT ───────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter-role');
  if (!el) return;
  const roles = ['Data Analyst 📊', 'UI/UX Designer 🎨', 'Problem Solver 🧠', 'Tech Volunteer 🌱'];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; return setTimeout(type, 1800); }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();
}

// ─── 4. GLITCH EFFECT ──────────────────────────
function initGlitch() {
  const el = document.getElementById('hero-name');
  if (!el) return;
  function triggerGlitch() {
    el.classList.add('glitching');
    setTimeout(() => el.classList.remove('glitching'), 350);
    setTimeout(triggerGlitch, Math.random() * 4000 + 3000);
  }
  setTimeout(triggerGlitch, 1500);
}

// ─── 5. ANIMATED STATS COUNTER ─────────────────
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ─── 6. SKILL RADAR CHART ──────────────────────
function initSkillRadar() {
  const canvas = document.getElementById('skill-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width = canvas.height = Math.min(canvas.parentElement.offsetWidth, 320);
  const cx = size / 2, cy = size / 2, r = size * 0.36;

  const skills = [
    { label: 'Data Analytics', value: 0.85 },
    { label: 'Python', value: 0.80 },
    { label: 'UI/UX Design', value: 0.78 },
    { label: 'Figma', value: 0.75 },
    { label: 'NLP / ML', value: 0.65 },
    { label: 'Storytelling', value: 0.90 },
  ];
  const N = skills.length;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const green = getComputedStyle(document.documentElement).getPropertyValue('--accent-green').trim() || '#9CAF88';
  const blue = getComputedStyle(document.documentElement).getPropertyValue('--accent-blue').trim() || '#A9CCE3';
  const textColor = isDark ? '#e6edf3' : '#344054';

  let progress = 0;
  function draw(p) {
    ctx.clearRect(0, 0, size, size);

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
        const rr = (r * ring / 4);
        const x = cx + rr * Math.cos(angle);
        const y = cy + rr * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < N; i++) {
      const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
      ctx.stroke();
    }

    // Filled area
    ctx.beginPath();
    skills.forEach((s, i) => {
      const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
      const rr = r * s.value * p;
      const x = cx + rr * Math.cos(angle);
      const y = cy + rr * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, green + 'cc');
    grad.addColorStop(1, blue + '55');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = green;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots + Labels
    skills.forEach((s, i) => {
      const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
      const rr = r * s.value * p;
      const x = cx + rr * Math.cos(angle);
      const y = cy + rr * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = green;
      ctx.fill();

      // Labels at full radius
      const lx = cx + (r + 22) * Math.cos(angle);
      const ly = cy + (r + 22) * Math.sin(angle);
      ctx.fillStyle = textColor;
      ctx.font = `600 11px Poppins, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.label, lx, ly);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    const start = performance.now();
    const duration = 1200;
    function animate(now) {
      progress = Math.min((now - start) / duration, 1);
      progress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      draw(progress);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, { threshold: 0.3 });
  observer.observe(canvas);

  // Redraw on theme change
  window.addEventListener('themechange', () => { 
    const isDark2 = document.documentElement.getAttribute('data-theme') === 'dark';
    draw(1); 
  });
}

// ─── 7. 3D TILT CARD EFFECT ────────────────────
function initCardTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const glare = card.querySelector('.card-glare');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.03,1.03,1.03)`;
      if (glare) glare.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(255,255,255,0.35) 0%, transparent 65%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    });
  });
}

// ─── 8. MAGNETIC BUTTONS ───────────────────────
function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  });
}

// ─── 9. DARK MODE TOGGLE ───────────────────────
function initDarkMode() {
  const toggle = document.getElementById('dark-toggle');
  if (!toggle) return;
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggle.classList.toggle('active', theme === 'dark');
    window.dispatchEvent(new Event('themechange'));
    setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 50);
  }
}

// ─── 10. KONAMI CODE EASTER EGG ────────────────
function initKonamiCode() {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === seq[idx]) {
      idx++;
      if (idx === seq.length) { idx = 0; triggerEasterEgg(); }
    } else { idx = e.key === seq[0] ? 1 : 0; }
  });

  function triggerEasterEgg() {
    const emojis = ['🎉','⭐','✨','🚀','💡','🎊','🌟','💻','🔥','🎯'];
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.cssText = `left:${Math.random()*100}vw;top:-20px;font-size:${Math.random()*20+14}px;background:transparent;animation-duration:${Math.random()*1.5+1.2}s;animation-delay:${Math.random()*0.5}s;width:auto;height:auto;border-radius:0;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
      }, i * 20);
    }
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#9CAF88,#A9CCE3);color:white;padding:14px 28px;border-radius:100px;font-family:Poppins,sans-serif;font-weight:700;font-size:14px;z-index:999999;box-shadow:0 8px 32px rgba(0,0,0,.2);white-space:nowrap;`;
    toast.textContent = '🎮 Konami Code! You found the easter egg! Respect++';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
}

// ─── 11. BACK TO TOP ───────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── INIT ALL ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const isMobileDevice = window.matchMedia('(max-width:767px)').matches || navigator.maxTouchPoints > 1;

  initScrollProgress();
  initDarkMode();
  initStatsCounter();
  initBackToTop();
  initTypewriter(); // lightweight — keep on mobile

  if (!isMobileDevice) {
    // Heavy / mouse-only features: skip on mobile
    initCustomCursor();       // rAF loop per frame — skip
    initGlitch();             // interval timer — skip
    initCardTilt();           // mousemove per card — skip
    initMagneticButtons();    // mousemove — skip
    initKonamiCode();         // keyboard only — skip
    setTimeout(initSkillRadar, 300); // canvas draw + rAF — skip
  }
});
