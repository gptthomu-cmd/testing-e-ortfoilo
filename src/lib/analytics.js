/**
 * Analytics + cookie consent.
 *
 * The site ships with no trackers at all, and analytics is opt-in twice:
 *   1. a real GA4 Measurement ID must be set in src/partials/head.html
 *      (the committed placeholder G-XXXXXXXXXX is ignored);
 *   2. the visitor must accept — the choice is remembered in localStorage.
 *
 * Until both are true the site makes exactly zero third-party requests.
 * When analytics is enabled, Google Consent Mode v2 starts in the "denied"
 * state and is only upgraded after an explicit opt-in.
 */

const STORE_KEY = 'thomu:analytics';
const ID_PATTERN = /^G-[A-Z0-9]{4,}$/;
const PLACEHOLDER = 'G-XXXXXXXXXX';

function measurementId() {
  const id = String(window.GA_MEASUREMENT_ID || '').trim();
  if (!id || id === PLACEHOLDER || !ID_PATTERN.test(id)) return null;
  return id;
}

function readChoice() {
  try {
    return localStorage.getItem(STORE_KEY);
  } catch {
    return null; // storage blocked — treat as "not asked yet"
  }
}

function writeChoice(value) {
  try {
    localStorage.setItem(STORE_KEY, value);
  } catch {
    /* nothing sensible to do if storage is unavailable */
  }
}

function loadGa(id) {
  if (document.querySelector('script[data-ga]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.dataset.ga = id;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', id, { allow_google_signals: false });
}

function readyGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

/**
 * Bottom-left consent card.
 * @param {string|null} id  a valid Measurement ID, or null when analytics is off
 * @param {boolean} force   re-open even if a choice is already stored
 */
function showNotice(id, force) {
  if (document.querySelector('.consent')) return;

  const enabled = Boolean(id);
  const card = document.createElement('div');
  card.className = 'consent';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-live', 'polite');
  card.setAttribute('aria-label', 'Analytics consent');
  card.innerHTML = enabled
    ? `
      <p class="consent__text">
        This site loads no trackers by default. Analytics helps me see which pages are actually
        useful — it only loads if you accept, and your choice stays on this device.
      </p>
      <div class="consent__actions">
        <button class="btn btn--sm btn--primary" type="button" data-consent="granted">Accept</button>
        <button class="btn btn--sm btn--ghost" type="button" data-consent="denied">Decline</button>
        <a class="consent__link" href="/privacy/">Privacy</a>
      </div>`
    : `
      <p class="consent__text">
        <strong>No trackers in use.</strong> This site sets no cookies, runs no analytics and makes
        no third-party requests — so there is nothing to accept or decline.
      </p>
      <div class="consent__actions">
        <button class="btn btn--sm btn--ghost" type="button" data-consent="close">Close</button>
        <a class="consent__link" href="/privacy/">Privacy</a>
      </div>`;

  const close = () => {
    card.classList.remove('is-visible');
    window.setTimeout(() => card.remove(), 250);
  };

  card.addEventListener('click', (event) => {
    const button = event.target.closest('[data-consent]');
    if (!button) return;
    const choice = button.dataset.consent;

    if (choice === 'close') {
      close();
      return;
    }

    writeChoice(choice);
    if (choice === 'granted' && enabled) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      loadGa(id);
    }
    close();
  });

  document.addEventListener('keydown', function onKey(event) {
    if (event.key === 'Escape') {
      document.removeEventListener('keydown', onKey);
      if (enabled) writeChoice('denied'); // dismissing without choosing = decline
      close();
    }
  });

  document.body.appendChild(card);
  // A beat of delay so the card does not fight the page entrance animation,
  // unless the visitor opened it deliberately (force) — then show it at once.
  window.setTimeout(() => card.classList.add('is-visible'), force ? 10 : 600);
  const first = card.querySelector('[data-consent]');
  if (first) first.focus({ preventScroll: true });
}

export function initAnalytics() {
  const id = measurementId();
  if (!id) return; // placeholder or empty → stay tracker-free

  readyGtag();
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });

  const choice = readChoice();
  if (choice === 'granted') {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    loadGa(id);
  } else if (choice !== 'denied') {
    showNotice(id);
  }
}

/** Footer "Cookie settings" control — always available, honest when analytics is off. */
export function initConsentControls() {
  const triggers = document.querySelectorAll('[data-consent-settings]');
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const id = measurementId();
      if (!id) {
        showNotice(null, true);
        return;
      }
      readyGtag();
      showNotice(id, true);
    });
  });
}
