"use client";

/**
 * Core Web Vitals reporting.
 *
 * Next.js reports LCP/CLS/INP/FCP/TTFB as they are measured. Events are pushed
 * into the GA4 dataLayer (they stay queued if analytics has not been consented
 * to yet, and are dropped if the visitor declined), and echoed to the console in
 * development so regressions show up before deploy.
 */
import { useReportWebVitals } from "next/web-vitals";
import { ANALYTICS } from "@/lib/site";

type Metric = {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating?: string;
  navigationType?: string;
};

/** Google's "good" thresholds, in milliseconds (CLS is unitless). */
const THRESHOLDS: Record<string, [number, number]> = {
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function rating(name: string, value: number): "good" | "needs-improvement" | "poor" {
  const [good, ok] = THRESHOLDS[name] ?? [0, 0];
  if (value <= good) return "good";
  if (value <= ok) return "needs-improvement";
  return "poor";
}

export function WebVitals() {
  useReportWebVitals((metric) => {
    const m = metric as unknown as Metric;
    const value = m.name === "CLS" ? Math.round(m.value * 1000) / 1000 : Math.round(m.value);
    const band = rating(m.name, value);

    if (process.env.NODE_ENV !== "production") {
      console.debug(`[web-vitals] ${m.name}: ${value} (${band})`);
    }

    window.gtag?.("event", ANALYTICS.webVitalsEvent, {
      metric_name: m.name,
      metric_value: value,
      metric_delta: m.name === "CLS" ? Math.round(m.delta * 1000) / 1000 : Math.round(m.delta),
      metric_rating: band,
      metric_id: m.id,
      non_interaction: true,
    });
  });

  return null;
}
