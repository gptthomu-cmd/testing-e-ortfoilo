"use client";

/**
 * Cookie / privacy controls.
 *
 *  - `ConsentBanner`  — non-blocking notice, appears only while a choice is pending.
 *  - `ConsentControls` — reusable controls embedded in /cookies/ so consent can be
 *    changed or withdrawn at any time (a GDPR/DPDP requirement).
 *
 * The choice lives in localStorage only; nothing is transmitted.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_STORAGE_KEY, analyticsEnabled } from "./Analytics";

type Choice = "granted" | "denied";
type Stored = { analytics: boolean; ts: string; version: 1 };

function persist(choice: Choice) {
  const payload: Stored = {
    analytics: choice === "granted",
    ts: new Date().toISOString(),
    version: 1,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* storage disabled — the choice simply will not persist */
  }
  if (choice === "granted") window.__thomuAnalytics?.load(true);
  else window.__thomuAnalytics?.revoke();
}

function read(): Choice | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    return parsed.analytics ? "granted" : "denied";
  } catch {
    return null;
  }
}

function useConsent() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = read();
    setChoice(stored);
    setReady(true);
    // A previously-granted visitor should get analytics even on a fresh session.
    if (stored === "granted") window.__thomuAnalytics?.load(true);
  }, []);

  const decide = useCallback((next: Choice) => {
    persist(next);
    setChoice(next);
  }, []);

  return { choice, ready, decide };
}

export function ConsentBanner() {
  const { choice, ready, decide } = useConsent();
  const enabled = analyticsEnabled();

  if (!ready || choice !== null || !enabled) return null;

  return (
    <div className="consent-banner" role="region" aria-label="Cookie consent">
      <div className="consent-inner">
        <p className="small muted" style={{ margin: 0 }}>
          <strong style={{ color: "var(--ink)" }}>Analytics is off until you say otherwise.</strong>{" "}
          This site sets no tracking cookies by default. Accepting enables Google Analytics 4
          (anonymised) so I can see which pages are useful. Read the{" "}
          <Link href="/privacy-policy/">privacy policy</Link> or change your mind any time on the{" "}
          <Link href="/cookies/">cookie controls</Link> page.
        </p>
        <div className="consent-actions">
          <button type="button" className="btn btn-primary" onClick={() => decide("granted")}>
            Accept analytics
          </button>
          <button type="button" className="btn" onClick={() => decide("denied")}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConsentControls() {
  const { choice, ready, decide } = useConsent();
  const enabled = analyticsEnabled();

  const status = !ready
    ? "Reading your saved preference…"
    : !enabled
      ? "Analytics is not configured on this site yet, so nothing is collected either way."
      : choice === "granted"
        ? "Analytics: accepted. Google Analytics 4 is active with IP anonymisation and advertising features disabled."
        : choice === "denied"
          ? "Analytics: declined. No analytics script is loaded and no analytics cookies are set."
          : "Analytics: no choice recorded yet, so it is off. Nothing is collected until you accept.";

  return (
    <div className="consent-controls-panel">
      <p className="consent-status" role="status" aria-live="polite">
        {status}
      </p>
      <div className="consent-actions">
        <button
          type="button"
          className={`btn ${choice === "granted" ? "btn-primary" : ""}`}
          onClick={() => decide("granted")}
          disabled={!enabled}
        >
          Accept analytics
        </button>
        <button
          type="button"
          className={`btn ${choice === "denied" ? "btn-primary" : ""}`}
          onClick={() => decide("denied")}
        >
          Decline analytics
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            try {
              window.localStorage.removeItem(CONSENT_STORAGE_KEY);
            } catch {
              /* ignore */
            }
            window.__thomuAnalytics?.revoke();
            window.location.reload();
          }}
        >
          Clear my choice
        </button>
      </div>
      {!enabled && (
        <p className="small muted" style={{ marginTop: "0.8rem", marginBottom: 0 }}>
          The controls stay in place so this page describes the real behaviour of the site: with no
          measurement ID configured, no analytics request is ever made.
        </p>
      )}
    </div>
  );
}
