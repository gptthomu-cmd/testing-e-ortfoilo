/**
 * Entry point — George S. Thomas · Digital Headquarters
 *
 * Design rules for this bundle:
 *  - no framework, no runtime dependencies
 *  - every feature degrades gracefully when JS is unavailable
 *  - motion is opt-out (OS preference + an in-page toggle in the footer)
 */

import './styles/main.css';

import { initReveal } from './lib/reveal.js';
import { initNav, initSmoothScroll } from './lib/nav.js';
import { initMagnetic } from './lib/magnetic.js';
import { initHeroMesh } from './lib/heroMesh.js';
import { initEcosystem } from './lib/eco.js';
import { initFlow } from './lib/flow.js';
import { initMap } from './lib/map.js';
import { initProjects } from './lib/projects.js';
import { initCardSpotlight } from './lib/interactions.js';

const start = () => {
  initNav();
  initSmoothScroll();
  initReveal();
  initMagnetic();
  initHeroMesh();
  initEcosystem();
  initFlow();
  initMap();
  initProjects();
  initCardSpotlight();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
