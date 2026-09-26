/**
 * NKT ecosystem diagram — an expandable, keyboard-accessible node explorer.
 * The panel content comes from src/data/content.js.
 */

import { ecosystem } from '../data/content.js';

const pinIcon = `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 14s5-4.3 5-8A5 5 0 0 0 3 6c0 3.7 5 8 5 8Z" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="6" r="1.6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>`;

function render(key) {
  const data = ecosystem[key];
  if (!data) return '';

  const tags = data.tags?.length
    ? `<ul class="chip-row">${data.tags.map((t) => `<li class="chip chip--sm">${t}</li>`).join('')}</ul>`
    : '';

  const loc = data.location
    ? `<p class="eco__panel-loc">${pinIcon}<span>${data.location}</span></p>`
    : '';

  return `
    <span class="status status--${data.status}">${data.status}</span>
    <h3>${data.title}</h3>
    ${data.body.map((p) => `<p>${p}</p>`).join('')}
    ${tags}
    ${loc}
  `;
}

export function initEcosystem() {
  const root = document.querySelector('[data-eco]');
  if (!root) return;

  const panel = root.querySelector('[data-eco-panel]');
  const nodes = Array.from(root.querySelectorAll('[data-eco-node]'));
  if (!panel || !nodes.length) return;

  const select = (key) => {
    nodes.forEach((n) => {
      const on = n.dataset.ecoNode === key;
      n.classList.toggle('is-selected', on);
      n.setAttribute('aria-pressed', String(on));
    });
    panel.innerHTML = render(key);
  };

  nodes.forEach((node) => {
    node.addEventListener('click', () => select(node.dataset.ecoNode));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(node.dataset.ecoNode);
      }
    });
  });

  select('group');
}
