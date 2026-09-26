/**
 * The Long Game — interactive ecosystem map.
 * Selecting a stage reveals how it connects to the rest of the chain.
 */

import { visionNodes } from '../data/content.js';

function render(key) {
  const data = visionNodes[key];
  if (!data) return '';

  const points = data.points?.length
    ? `<ul>${data.points.map((p) => `<li>${p}</li>`).join('')}</ul>`
    : '';

  return `
    <span class="status status--${data.status}">${data.status}</span>
    <h3>${data.title}</h3>
    <p>${data.body}</p>
    ${points}
  `;
}

export function initMap() {
  const root = document.querySelector('[data-map]');
  if (!root) return;

  const panel = root.querySelector('[data-map-panel]');
  const nodes = Array.from(root.querySelectorAll('[data-map-node]'));
  if (!panel || !nodes.length) return;

  const hint = panel.innerHTML;

  const select = (key) => {
    nodes.forEach((n) => {
      const on = n.dataset.mapNode === key;
      n.classList.toggle('is-selected', on);
      n.setAttribute('aria-pressed', String(on));
    });
    panel.innerHTML = render(key);
  };

  nodes.forEach((node) => {
    node.addEventListener('click', () => select(node.dataset.mapNode));
    node.addEventListener('pointerenter', () => {
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) select(node.dataset.mapNode);
    });
  });

  // Keep the guidance text discoverable: selecting via keyboard focus also works
  nodes.forEach((node) => {
    node.addEventListener('focus', () => select(node.dataset.mapNode));
  });

  panel.dataset.hint = hint;
}
