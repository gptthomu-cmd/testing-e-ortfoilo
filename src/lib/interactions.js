/**
 * Small, shared interaction helpers.
 * Currently: pointer-follow highlight for grid cards (desktop only, opt-out
 * with reduced motion). Kept deliberately tiny — no animation libraries.
 */

export function initCardSpotlight(selector = '.labcard, .osworld, .evcard, .hobby') {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}
