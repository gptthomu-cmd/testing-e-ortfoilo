/**
 * Scroll-reveal + section observation.
 * Uses a single IntersectionObserver, unobserves after firing, and respects
 * the reduce-motion preference (in which case it does nothing at all).
 */

const reduced = () => document.documentElement.classList.contains('reduce-motion')
  || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal() {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;

  // Stagger hints declared in markup: data-reveal-delay="120"
  items.forEach((el) => {
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if (reduced() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach((el) => io.observe(el));
}
