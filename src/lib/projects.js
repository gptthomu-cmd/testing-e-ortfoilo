/**
 * The Open-Source Universe — project index.
 *
 * Renders only what exists. While src/data/content.js exports an empty
 * `projects` array, the grid and its filter are hidden and the honest empty
 * state is shown instead: no invented repositories, no dead links.
 */

import { projects } from '../data/content.js';

const githubIcon = `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.94.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`;

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

function card(p) {
  const link = p.github
    ? `<a class="projcard__name" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">${esc(p.name)}${githubIcon}</a>`
    : `<span class="projcard__name">${esc(p.name)}</span>`;

  return `
    <li class="projcard" data-world="${esc(p.world)}">
      <div class="projcard__top">
        ${link}
        <span class="status status--${statusTone(p.status)}">${esc(p.status)}</span>
      </div>
      <p class="projcard__purpose">${esc(p.purpose)}</p>
      <div class="projcard__foot">
        <span>${esc(p.world)}</span>
      </div>
    </li>
  `;
}

function statusTone(status = '') {
  const s = status.toLowerCase();
  if (s === 'completed') return 'current';
  if (s === 'active') return 'active';
  if (s === 'experimental') return 'experimental';
  if (s === 'planned' || s === 'wishlist') return 'planned';
  return 'vision';
}

export function initProjects() {
  const grid = document.querySelector('[data-project-grid]');
  const empty = document.querySelector('[data-project-empty]');
  const bar = document.querySelector('.osfilter__bar');
  const title = document.querySelector('.osfilter__title');
  if (!grid) return;

  if (!projects.length) {
    grid.hidden = true;
    if (empty) empty.hidden = false;
    if (bar) bar.hidden = true;
    if (title) title.textContent = 'Project index — awaiting first releases';
    return;
  }

  grid.innerHTML = projects.map(card).join('');
  if (empty) empty.hidden = true;

  if (!bar) return;
  const buttons = Array.from(bar.querySelectorAll('[data-filter]'));

  const apply = (world) => {
    let visible = 0;
    grid.querySelectorAll('.projcard').forEach((el) => {
      const show = world === 'all' || el.dataset.world === world;
      el.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      apply(btn.dataset.filter);
    });
  });
}
