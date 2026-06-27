/* ============================================================
   Portfolio — Vitor Bernhard Calliari
   main.js
   ============================================================ */

const html = document.documentElement;

/* ── THEME TOGGLE ── */
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  themeBtn.textContent = isDark ? '🌙' : '☀️';
});

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── CANVAS PARTICLE GRID ── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, dots = [];
const mouse   = { x: -999, y: -999 };
const SPACING = 48;
const RADIUS  = 6;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  dots = [];
  for (let x = SPACING; x < W; x += SPACING) {
    for (let y = SPACING; y < H; y += SPACING) {
      dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
    }
  }
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
resize();

function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0, 0, W, H);

  const isDark    = html.dataset.theme !== 'light';
  const dotColor  = isDark ? 'rgba(79,142,247,0.5)'  : 'rgba(37,99,235,0.4)';
  const lineColor = isDark ? 'rgba(79,142,247,0.08)' : 'rgba(37,99,235,0.06)';

  dots.forEach(d => {
    const dx   = mouse.x - d.x;
    const dy   = mouse.y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < RADIUS * 15) {
      const force = (RADIUS * 15 - dist) / (RADIUS * 15);
      d.vx -= dx * force * 0.04;
      d.vy -= dy * force * 0.04;
    }

    d.vx += (d.ox - d.x) * 0.06;
    d.vy += (d.oy - d.y) * 0.06;
    d.vx *= 0.78;
    d.vy *= 0.78;
    d.x  += d.vx;
    d.y  += d.vy;

    ctx.beginPath();
    ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    dots.forEach(d2 => {
      const ex = d.x - d2.x;
      const ey = d.y - d2.y;
      const ed = Math.sqrt(ex * ex + ey * ey);
      if (ed < SPACING * 1.5 && ed > 0) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    });
  });
}

loop();

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ── */
const counters    = document.querySelectorAll('[data-target]');
const counterObs  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    let cur      = 0;
    const step   = () => {
      cur++;
      const isExact = el.dataset.exact === 'true';
      el.textContent = cur + (cur < target || isExact ? '' : '+');
      if (cur < target) setTimeout(step, 120);
    };
    step();
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObs.observe(c));

/* ── TERMINAL TYPING ── */
const cmds    = ['ls habilidades/', 'cat experiencia.md', 'git log --oneline'];
let cmdIndex  = 0;
let charIndex = 0;
const typedEl = document.getElementById('typed-cmd');

function typeNext() {
  if (!typedEl) return;
  const cmd = cmds[cmdIndex % cmds.length];
  if (charIndex <= cmd.length) {
    typedEl.textContent = cmd.slice(0, charIndex++);
    setTimeout(typeNext, 90);
  } else {
    setTimeout(() => {
      charIndex = 0;
      cmdIndex++;
      typedEl.textContent = '';
      typeNext();
    }, 1800);
  }
}

setTimeout(typeNext, 1500);
