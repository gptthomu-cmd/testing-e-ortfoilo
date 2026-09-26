export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    /** Set by the inline analytics bootstrap in `Analytics.tsx`. */
    __thomuAnalytics?: {
      id: string;
      /** Inject gtag.js. `granted` also flips Consent Mode to granted. */
      load: (granted: boolean) => void;
      /** Flip Consent Mode back to denied and drop GA cookies. */
      revoke: () => void;
    };
    __thomuGaLoaded?: boolean;
  }
}
