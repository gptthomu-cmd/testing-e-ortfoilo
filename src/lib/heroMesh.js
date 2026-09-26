/**
 * Hero mesh — a slow, low-density node network drawn on canvas.
 *
 * Performance rules:
 *  - density scales with viewport width
 *  - frame rate capped (~32fps), it is ambient, not interactive
 *  - stops completely when the hero scrolls away or the tab is hidden
 *  - renders one static frame when reduced motion is requested
 */

const LINK_DIST = 148;
const FPS = 32;
const FRAME = 1000 / FPS;

export function initHeroMesh() {
  const canvas = document.querySelector('[data-hero-mesh]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => reduceQuery.matches || document.documentElement.classList.contains('reduce-motion');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  let pulses = [];
  let raf = 0;
  let last = 0;
  let running = false;

  const makeNodes = () => {
    const count = width < 620 ? 20 : width < 1100 ? 32 : 46;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      r: Math.random() * 1.1 + 0.5
    }));
    pulses = [];
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeNodes();
  };

  const draw = (dt) => {
    ctx.clearRect(0, 0, width, height);

    // links
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST * LINK_DIST) continue;
        const d = Math.sqrt(d2);
        const alpha = (1 - d / LINK_DIST) * 0.3;
        ctx.strokeStyle = `rgba(84, 226, 214, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // nodes + drift
    for (const n of nodes) {
      if (dt) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140, 240, 227, 0.62)';
      ctx.fill();
    }

    // travelling pulses along links
    if (dt && nodes.length > 3) {
      if (pulses.length < 7 && Math.random() < 0.05) {
        const a = nodes[(Math.random() * nodes.length) | 0];
        const b = nodes[(Math.random() * nodes.length) | 0];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
          pulses.push({ a, b, t: 0, speed: 0.00035 + Math.random() * 0.0005 });
        }
      }
      pulses = pulses.filter((p) => {
        p.t += p.speed * dt;
        if (p.t >= 1) return false;
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, 'rgba(150, 255, 240, 0.9)');
        g.addColorStop(1, 'rgba(53, 230, 208, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
    }
  };

  const loop = (now) => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (now - last < FRAME) return;
    const dt = Math.min(now - last, 60) / 16.6;
    last = now;
    draw(dt);
  };

  const start = () => {
    if (running || isReduced()) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  resize();
  if (isReduced()) {
    draw(0);
  } else {
    start();
  }

  // pause when the hero leaves the viewport
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isReduced()) start();
      else if (!entry.isIntersecting) stop();
      else draw(0);
    }, { threshold: 0 });
    io.observe(canvas);
  }

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      stop();
      resize();
      isReduced() ? draw(0) : start();
    }, 200);
  };
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  reduceQuery.addEventListener('change', (e) => {
    if (e.matches) { stop(); draw(0); } else { start(); }
  });
}
