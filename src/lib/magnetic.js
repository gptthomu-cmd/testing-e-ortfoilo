/**
 * Magnetic buttons — a very small pull toward the pointer.
 * Desktop pointers only, disabled for reduced motion, reset on blur/leave.
 */

const STRENGTH = 0.22;
const MAX = 7;

export function initMagnetic() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    let raf = 0;

    const move = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        const x = Math.max(-MAX, Math.min(MAX, dx));
        const y = Math.max(-MAX, Math.min(MAX, dy));
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
    };

    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      el.style.transform = '';
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    el.addEventListener('blur', reset);
  });
}
