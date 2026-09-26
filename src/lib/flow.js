/**
 * My_AI_OS architecture flow — progressive disclosure of each layer.
 * One layer open at a time; full keyboard support; content from data/content.js.
 */

import { aiLayers } from '../data/content.js';

export function initFlow() {
  const root = document.querySelector('[data-aios]');
  if (!root) return;

  const steps = Array.from(root.querySelectorAll('[data-flow-step]'));
  if (!steps.length) return;

  const buttons = steps.map((step) => step.querySelector('.flow__btn'));

  // Swap the short markup hint for the full explanation, keeping the short one
  // as the no-JS fallback.
  buttons.forEach((btn) => {
    const index = btn.querySelector('.flow__index')?.textContent?.trim();
    const hint = btn.querySelector('.flow__hint');
    if (hint && aiLayers[index]) hint.textContent = aiLayers[index];
  });

  const setOpen = (button, open) => {
    button.setAttribute('aria-expanded', String(open));
    button.closest('[data-flow-step]')?.classList.toggle('is-open', open);
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      buttons.forEach((other) => setOpen(other, false));
      if (willOpen) setOpen(btn, true);
    });
  });

  // open the first layer so the pattern is obvious
  if (buttons[0]) setOpen(buttons[0], true);
}
