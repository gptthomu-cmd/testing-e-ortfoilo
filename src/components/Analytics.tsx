/**
 * Google Analytics 4 with Consent Mode v2, loaded *after* consent.
 *
 * Nothing is requested from Google until the visitor accepts analytics
 * (see `ConsentBanner` / `ConsentControls`). The inline bootstrap runs before
 * paint so `gtag` exists for early events, but the network request that would
 * set `_ga` only happens on `load()`.
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID (or ANALYTICS.measurementId) to enable.
 */
import { ANALYTICS, isFilled } from "@/lib/site";

export const CONSENT_STORAGE_KEY = "thomu.consent.v1";

export function analyticsEnabled(): boolean {
  return isFilled(ANALYTICS.measurementId);
}

export function Analytics() {
  const id = ANALYTICS.measurementId;
  if (!isFilled(id)) return null;

  const config = JSON.stringify({
    id,
    mode: ANALYTICS.consentMode,
    event: ANALYTICS.webVitalsEvent,
    debug: ANALYTICS.debug,
  });

  const bootstrap = `(function(){var CFG=${config};window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});function read(){try{var r=localStorage.getItem('${CONSENT_STORAGE_KEY}');if(!r)return null;var p=JSON.parse(r);return p&&p.analytics?'granted':'denied';}catch(e){return null;}}function dnt(){try{return navigator.doNotTrack==='1'||window.doNotTrack==='1'||navigator.msDoNotTrack==='1'||navigator.globalPrivacyControl===true;}catch(e){return false;}}window.__thomuAnalytics={id:CFG.id,load:function(granted){if(window.__thomuGaLoaded)return;window.__thomuGaLoaded=true;if(granted){gtag('consent','update',{analytics_storage:'granted'});}var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(CFG.id);document.head.appendChild(s);gtag('config',CFG.id,{anonymize_ip:true,send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_flags:'SameSite=Lax;Secure'});},revoke:function(){window.__thomuGaLoaded=false;gtag('consent','update',{analytics_storage:'denied'});document.cookie.split(';').forEach(function(c){var n=c.split('=')[0].trim();if(n.indexOf('_ga')===0||n.indexOf('_gid')===0){document.cookie=n+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';}});}};var state=read();if(state==='granted'){window.__thomuAnalytics.load(true);}else if(state===null&&CFG.mode==='advanced'&&!dnt()){window.__thomuAnalytics.load(false);}})();`;

  return <script id="ga4-bootstrap" dangerouslySetInnerHTML={{ __html: bootstrap }} />;
}

/**
 * External preconnect for the analytics origin, only when analytics can run.
 * Keeps the third-party connection off the critical path but warm once
 * consent is granted.
 */
export function AnalyticsPreconnect() {
  if (!analyticsEnabled()) return null;
  return <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />;
}
