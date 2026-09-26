/**
 * Navigation: sticky state, scroll progress, mobile overlay, scroll-spy and
 * reduced-motion toggle. Everything degrades gracefully without JS.
 */

const NAV_OFFSET = 90;

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  const progress = document.querySelector('[data-nav-progress]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const overlay = document.querySelector('[data-nav-overlay]');
  const links = Array.from(document.querySelectorAll('[data-navlink]'));
  const yearEl = document.querySelector('[data-year]');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- sticky + progress (one rAF-throttled scroll handler) ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle('is-stuck', y > 12);

      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
        progress.style.width = `${pct}%`;
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- scroll spy ---------- */
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: `-${NAV_OFFSET}px 0px -65% 0px`, threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- overlay menu ---------- */
  const closeOverlay = () => {
    if (!overlay || !toggle) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openOverlay = () => {
    if (!overlay || !toggle) return;
    overlay.removeAttribute('hidden');
    // next frame so the transition runs
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    const first = overlay.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  };

  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      open ? closeOverlay() : openOverlay();
    });

    // any in-page navigation (including the sticky CTA) closes the overlay
    document.addEventListener('click', (e) => {
      if (e.target.closest('a[href^="#"]')) closeOverlay();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeOverlay();
    });

    // Close if the viewport grows into desktop layout
    const mq = window.matchMedia('(min-width: 1060px)');
    mq.addEventListener('change', (e) => { if (e.matches) closeOverlay(); });
  }

  /* ---------- reduced-motion toggle (persisted) ---------- */
  const motionBtn = document.querySelector('[data-motion-toggle]');
  if (motionBtn) {
    const stored = localStorage.getItem('thomu:motion') === 'reduced';
    const apply = (isReduced) => {
      document.documentElement.classList.toggle('reduce-motion', isReduced);
      motionBtn.setAttribute('aria-pressed', String(isReduced));
      motionBtn.textContent = isReduced ? 'Motion reduced' : 'Reduce motion';
    };
    apply(stored);
    motionBtn.addEventListener('click', () => {
      const next = !document.documentElement.classList.contains('reduce-motion');
      localStorage.setItem('thomu:motion', next ? 'reduced' : 'full');
      apply(next);
    });
  }
}

/** Smooth in-page scrolling with correct header offset for browsers without scroll-padding. */
export function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const reduce = document.documentElement.classList.contains('reduce-motion')
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = target.getBoundingClientRect().top + window.scrollY - (NAV_OFFSET - 20);

    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
    // keep keyboard focus meaningful
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}
