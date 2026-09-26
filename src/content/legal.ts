/**
 * Legal documents: Privacy Policy, Terms & Disclaimer, Cookie & Privacy Controls.
 *
 * These are written to describe exactly what this website does — static hosting,
 * optional GA4 analytics, an email contact, and consent stored in localStorage.
 * They are a good-faith baseline, not legal advice: have them reviewed before you
 * rely on them commercially.
 */

export type LegalDocument = {
  slug: string;
  path: string;
  title: string;
  seoTitle: string;
  description: string;
  updated: string;
  intro: string;
  keywords: string[];
  sections: { id: string; heading: string; html: string }[];
};

export const LEGAL_UPDATED = "2026-09-26";

export const PRIVACY_POLICY: LegalDocument = {
  slug: "privacy-policy",
  path: "/privacy-policy/",
  title: "Privacy Policy",
  seoTitle: "Privacy Policy",
  description:
    "How George S. Thomas handles personal data on this website: what is collected, why, legal bases under GDPR and India's DPDP Act, retention and your rights.",
  updated: LEGAL_UPDATED,
  keywords: ["privacy policy", "GDPR", "DPDP Act 2023", "Google Analytics data", "data rights"],
  intro:
    "This policy explains what happens to your data when you visit this website. It is written to be read: short sections, plain language, and no data collection that is not described here.",
  sections: [
    {
      id: "who-we-are",
      heading: "Who is responsible for your data",
      html: `
<p>The data controller for this website is <strong>George S. Thomas</strong> (also known as Thomu / George Nedumpurath), an individual based in Thodupuzha, Idukki district, Kerala, India. Where this policy says "I" or "me", it means George S. Thomas; "this site" means this website and its pages.</p>
<p>For any privacy question, request or complaint, contact <a href="/contact/">the contact page</a> or email the address published there. Requests are normally answered within 30 days.</p>
`,
    },
    {
      id: "what-is-collected",
      heading: "What is collected, and what is not",
      html: `
<p>This is a static website. There is no login, no user account, no comment system and no e-commerce checkout. That means the categories of data involved are small.</p>
<h3>1. Information you send me voluntarily</h3>
<ul>
  <li><strong>Email and messages.</strong> If you write to me, I receive your email address, your name (if you give it) and whatever you include in the message. This is used solely to reply and to keep a record of the conversation.</li>
</ul>
<h3>2. Analytics data (only if you consent)</h3>
<ul>
  <li><strong>Google Analytics 4</strong> may be loaded <em>after you accept analytics cookies</em>. It records aggregated usage: pages viewed, approximate location derived from IP (city level), device and browser type, referring source, and interaction events such as outbound link clicks and scroll depth.</li>
  <li>Google Analytics is configured with IP anonymisation and with advertising features disabled. No data is used to build advertising audiences on this site.</li>
  <li>If you decline, or simply do not accept, no analytics script is loaded at all.</li>
</ul>
<h3>3. Technical logs</h3>
<ul>
  <li>The site is served as static files by a hosting provider (GitHub Pages). Like virtually all hosts, the provider may keep short-lived access logs including IP address, user agent and requested URL, for security and abuse prevention. I do not have access to a personal analytics view of those logs.</li>
</ul>
<h3>What is deliberately not collected</h3>
<ul>
  <li>No account credentials, no payment data, no precise geolocation, no biometric data.</li>
  <li>No data about your vehicle, charging sessions or energy usage is collected from this website. Charging sessions at NKT Charge Hub are handled by the charge-point network operator under its own privacy terms, which are separate from this website.</li>
  <li>No personal data is ever sold, rented or shared for advertising.</li>
</ul>
`,
    },
    {
      id: "legal-bases",
      heading: "Why I am allowed to use it (legal bases)",
      html: `
<p>Depending on where you are, different rules apply. I rely on the following bases:</p>
<ul>
  <li><strong>Consent</strong> — for analytics cookies and any optional measurement. You can withdraw it at any time via the <a href="/cookies/">cookie controls</a>.</li>
  <li><strong>Legitimate interests</strong> — for replying to messages you send me voluntarily, and for keeping the site secure and available.</li>
  <li><strong>Legal obligation</strong> — where a law requires me to keep or disclose something.</li>
</ul>
<p>Under India's <strong>Digital Personal Data Protection Act, 2023</strong>, I act as a Data Fiduciary for the limited data described above and process it for the lawful purposes stated here, with your consent where required. Under the EU/UK <strong>GDPR</strong>, I am a controller and rely on the bases listed above.</p>
`,
    },
    {
      id: "cookies",
      heading: "Cookies and similar technologies",
      html: `
<p>Cookies are small files stored by your browser. This site uses as few as possible:</p>
<ul>
  <li><strong>Strictly necessary:</strong> a single entry in your browser's <code>localStorage</code> that remembers your cookie choice, so the banner does not ask again. It contains no identifier and is never sent to a server.</li>
  <li><strong>Analytics (optional):</strong> Google Analytics sets cookies such as <code>_ga</code> and <code>_ga_&lt;ID&gt;</code>. These are created only after you accept analytics.</li>
</ul>
<p>Full detail, including how to change or withdraw your choice and how to block cookies in your browser, is on the <a href="/cookies/">Cookie &amp; Privacy Controls</a> page.</p>
`,
    },
    {
      id: "sharing",
      heading: "Who else sees the data (processors)",
      html: `
<p>Where a third party processes data on my behalf, it is listed here:</p>
<ul>
  <li><strong>Google Ireland Limited / Google LLC</strong> — Google Analytics 4 and Google Search Console. Search Console shows aggregated search performance and does not involve cookies on your visit. Google's handling is described in Google's own privacy policy.</li>
  <li><strong>GitHub, Inc. (Microsoft)</strong> — static hosting and delivery via GitHub Pages, including standard access logs.</li>
  <li><strong>Email provider</strong> — whichever mailbox hosts the address published on the contact page.</li>
</ul>
<p>These providers may process data outside India, including in the United States and the EU. Transfers rely on the providers' standard contractual clauses and, for Indian residents, on the permitted transfer grounds under the DPDP Act.</p>
<p>I will also disclose data if legally compelled to do so, and only to the extent required.</p>
`,
    },
    {
      id: "retention",
      heading: "How long it is kept",
      html: `
<ul>
  <li><strong>Correspondence:</strong> kept while the conversation is relevant, then reviewed and deleted — normally within 24 months of the last exchange.</li>
  <li><strong>Analytics:</strong> retained per the property's retention setting (currently 14 months, the GA4 default) and then deleted automatically.</li>
  <li><strong>Cookie preference:</strong> stored in your browser until you clear it or change the setting.</li>
  <li><strong>Hosting logs:</strong> controlled by the hosting provider's retention policy.</li>
</ul>
`,
    },
    {
      id: "your-rights",
      heading: "Your rights",
      html: `
<p>Subject to applicable law, you can ask me to:</p>
<ul>
  <li><strong>Access</strong> a copy of the personal data I hold about you.</li>
  <li><strong>Correct</strong> anything inaccurate.</li>
  <li><strong>Erase</strong> your data, where there is no overriding legal reason to keep it.</li>
  <li><strong>Restrict or object</strong> to processing, including an absolute right to object to direct marketing.</li>
  <li><strong>Port</strong> data you gave me to another provider, where technically feasible.</li>
  <li><strong>Withdraw consent</strong> at any time — for analytics, use the <a href="/cookies/">cookie controls</a>.</li>
</ul>
<p>Under India's DPDP Act you may also nominate another person to exercise these rights on your behalf in the event of death or incapacity, and you have the right to a grievance response from me and to approach the Data Protection Board of India. If you are in the EU/UK, you may also complain to your local supervisory authority.</p>
`,
    },
    {
      id: "security",
      heading: "Security",
      html: `
<p>The site is served over HTTPS only. There is no database and no user data store to breach, which removes most of the risk surface. Email is protected with a strong unique password and two-factor authentication. No system is perfectly secure, so I keep the amount of personal data held to the minimum needed to reply to you.</p>
`,
    },
    {
      id: "children",
      heading: "Children",
      html: `
<p>This site is aimed at a general professional audience and is not directed at children. I do not knowingly collect personal data from children. If you believe a child has sent me personal data, contact me and I will delete it.</p>
`,
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      html: `
<p>When this policy changes, the "last updated" date at the top of the page changes with it. Material changes that affect how analytics or contact data is handled will be reflected in the cookie banner as well.</p>
`,
    },
    {
      id: "contact-dpo",
      heading: "Contact",
      html: `
<p>Privacy questions, access requests and complaints: use the <a href="/contact/">contact page</a>. Please include enough detail for me to identify what the request relates to, and I will confirm receipt and respond within 30 days.</p>
`,
    },
  ],
};

export const TERMS: LegalDocument = {
  slug: "terms",
  path: "/terms/",
  title: "Terms of Use & Disclaimer",
  seoTitle: "Terms of Use & Disclaimer",
  description:
    "Terms of use and disclaimers for this website, including informational-only content, no financial or professional advice, intellectual property and governing law.",
  updated: LEGAL_UPDATED,
  keywords: ["terms of use", "disclaimer", "financial disclaimer", "website terms India"],
  intro:
    "These terms govern your use of this website. By browsing it you accept them. If you do not accept them, please stop using the site.",
  sections: [
    {
      id: "acceptance",
      heading: "1. Acceptance of these terms",
      html: `
<p>This website is published by <strong>George S. Thomas</strong>, an individual resident in Kerala, India. By accessing or using any part of it, you agree to these terms. These terms apply to the website only; separate terms may apply to services or products offered elsewhere.</p>
`,
    },
    {
      id: "informational",
      heading: "2. Informational purpose only",
      html: `
<p>All content on this site — including pages about ventures, projects, technical systems and writing — is provided for general information and documentation. It describes personal experience and opinion, and is not:</p>
<ul>
  <li>an offer, solicitation or advertisement for any goods or services;</li>
  <li>a specification, quotation or contractual commitment;</li>
  <li>a guarantee of availability, performance, uptime, pricing or suitability for any purpose.</li>
</ul>
<p>Where a page describes a physical location such as <a href="/ventures/nkt-charge-hub/">NKT Charge Hub</a>, details may change without notice: opening hours, availability, connector types, tariffs and staffing are operational matters and the live situation at the site always governs. Confirm important details before travelling.</p>
`,
    },
    {
      id: "no-advice",
      heading: "3. No professional advice — including financial",
      html: `
<p>Nothing here is professional advice. Specifically:</p>
<ul>
  <li><strong>Not financial or investment advice.</strong> Some pages mention quantitative trading research and market software as personal projects. That content is a description of engineering work, not a recommendation, signal, strategy or offer to manage money. Markets carry risk, including total loss of capital. Do your own research and consult a registered adviser where appropriate.</li>
  <li><strong>Not legal, tax or regulatory advice.</strong> Statements about privacy law, employment, or compliance are general descriptions of how this site operates.</li>
  <li><strong>Not electrical, engineering or safety advice.</strong> Content about EV charging, storage systems and homelab hardware is personal experience. Work on electrical installations must be done by qualified persons under applicable regulations.</li>
  <li><strong>Not medical or health advice.</strong> Nothing on this site addresses health matters.</li>
</ul>
`,
    },
    {
      id: "accuracy",
      heading: "4. Accuracy, completeness and the \u201Cas is\u201D basis",
      html: `
<p>Reasonable care is taken to keep information accurate, and unknown facts are deliberately left out rather than estimated. Even so, content is provided <strong>"as is"</strong> and <strong>"as available"</strong>, without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose and non-infringement.</p>
<p>I do not warrant that the site will be uninterrupted, error-free, current, or free of harmful components, or that any defect will be corrected.</p>
`,
    },
    {
      id: "ai-disclosure",
      heading: "5. Disclosure: AI-assisted content",
      html: `
<p>Some content on this site is drafted or scaffolded with the help of AI tooling as part of an engineering workflow, then reviewed, corrected and edited by me (see <a href="/work/my-ai-os/">My_AI_OS</a> for the process). Claims that cannot be verified are removed rather than published. Editorial responsibility for everything published here rests with me.</p>
`,
    },
    {
      id: "ip",
      heading: "6. Intellectual property",
      html: `
<p>Text, layout, code and original imagery on this site are &copy; George S. Thomas unless stated otherwise. You may read, quote and share with clear attribution and a link, and you may not republish content wholesale, resell it, or present it as your own. Brand names — including NKT Group, Nedumpurath Group, NKT Vessels House, NKT Charge Hub, Nedumpurath Towers, THOMU LAB, Apex Creator OS and My_AI_OS — are used to identify the businesses and projects they belong to. Third-party names such as IonGrid, DaVinci Resolve, Premiere Pro, Sony or Raspberry Pi are the property of their respective owners and are used for identification only. No endorsement or partnership beyond what is stated on these pages should be inferred.</p>
`,
    },
    {
      id: "third-party",
      heading: "7. Third-party links and services",
      html: `
<p>This site links to external websites and services (for example social profiles and network partners). I do not control them and am not responsible for their content, availability, security or privacy practices. Following an external link is at your own risk and subject to that site's terms.</p>
`,
    },
    {
      id: "acceptable-use",
      heading: "8. Acceptable use",
      html: `
<p>You agree not to: attempt to gain unauthorised access to any part of this site or its infrastructure; scrape or copy the site in a way that imposes unreasonable load; introduce malicious code; misrepresent your identity or affiliation; or use the site in breach of applicable law. Automated access that respects <a href="/robots.txt">/robots.txt</a> and reasonable rate limits is welcome.</p>
`,
    },
    {
      id: "liability",
      heading: "9. Limitation of liability",
      html: `
<p>To the maximum extent permitted by law, George S. Thomas shall not be liable for any indirect, incidental, special, consequential, exemplary or punitive damages, or for loss of profits, revenue, data, goodwill or business opportunity, arising from or connected with your use of, or inability to use, this site or its content. Nothing in these terms limits liability that cannot lawfully be limited, including for fraud or for death or personal injury caused by negligence.</p>
`,
    },
    {
      id: "indemnity",
      heading: "10. Indemnity",
      html: `
<p>You agree to indemnify and hold harmless George S. Thomas against claims, damages, losses and reasonable costs arising from your breach of these terms or your misuse of the site.</p>
`,
    },
    {
      id: "changes-terms",
      heading: "11. Changes and availability",
      html: `
<p>These terms may be updated at any time; the "last updated" date reflects the current version, and continued use after a change constitutes acceptance. The site, or any part of it, may be changed, suspended or withdrawn without notice — this is a personal website, not a paid service.</p>
`,
    },
    {
      id: "severability",
      heading: "12. Severability and entire agreement",
      html: `
<p>If any provision of these terms is found unenforceable, the remaining provisions stay in force. These terms, together with the <a href="/privacy-policy/">Privacy Policy</a>, are the entire agreement between you and me regarding use of this website.</p>
`,
    },
    {
      id: "governing-law",
      heading: "13. Governing law and jurisdiction",
      html: `
<p>These terms are governed by the laws of India. Subject to any mandatory consumer protections, the courts at Kerala, India have exclusive jurisdiction over any dispute arising from use of this site.</p>
`,
    },
    {
      id: "terms-contact",
      heading: "14. Contact",
      html: `
<p>Questions about these terms: use the <a href="/contact/">contact page</a>.</p>
`,
    },
  ],
};

export const COOKIE_POLICY: LegalDocument = {
  slug: "cookies",
  path: "/cookies/",
  title: "Cookie & Privacy Controls",
  seoTitle: "Cookie & Privacy Controls",
  description:
    "See what this site stores, what analytics cookies do, and change or withdraw your consent at any time with the built-in privacy controls.",
  updated: LEGAL_UPDATED,
  keywords: ["cookie settings", "privacy controls", "Google Analytics opt out", "withdraw consent"],
  intro:
    "This page lists every cookie and storage entry this site can create, and gives you working controls to change your choice. Your selection is stored in your own browser only — it is never sent anywhere.",
  sections: [
    {
      id: "controls",
      heading: "Your controls",
      html: `
<p>Use the buttons below to change your preference at any time. Declining is as easy as accepting, and choosing "decline" removes any analytics cookies this site previously set.</p>
<!--cookie-controls-->
`,
    },
    {
      id: "what-is-stored",
      heading: "What can be stored, and why",
      html: `
<table>
  <thead>
    <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Set when</th><th>Lifetime</th></tr>
  </thead>
  <tbody>
    <tr><td><code>thomu.consent.v1</code></td><td>localStorage</td><td>Remembers the choice you made here so the banner does not reappear</td><td>On selecting a preference</td><td>Until you clear site data</td></tr>
    <tr><td><code>_ga</code></td><td>Cookie (1st party)</td><td>Google Analytics — distinguishes anonymous visitors</td><td>Only after you accept analytics</td><td>Up to 2 years</td></tr>
    <tr><td><code>_ga_&lt;PROPERTY&gt;</code></td><td>Cookie (1st party)</td><td>Google Analytics — maintains anonymous session state</td><td>Only after you accept analytics</td><td>Up to 2 years</td></tr>
  </tbody>
</table>
<p>No advertising, profiling, cross-site tracking or social-media pixels are used on this site.</p>
`,
    },
    {
      id: "how-consent-works",
      heading: "How the consent works",
      html: `
<p>Analytics is <strong>off by default</strong>. No Google Analytics script is requested, and no analytics cookies are created, until you explicitly accept. When you accept, Google Consent Mode is initialised with analytics storage granted; when you decline, it is denied and the tag stays unloaded. Your stored preference can be deleted by clearing this site's data in your browser.</p>
<p>This is deliberately a "prior consent" model. It costs me a little measurement fidelity and it costs you nothing in privacy.</p>
`,
    },
    {
      id: "browser-controls",
      heading: "Controls in your browser",
      html: `
<ul>
  <li><strong>Block or delete cookies:</strong> every major browser has a privacy or site-data panel where you can delete cookies for this site or block third-party cookies entirely.</li>
  <li><strong>Do Not Track / Global Privacy Control:</strong> if your browser signals a privacy preference, the analytics script stays unloaded by default — the same as declining.</li>
  <li><strong>Google Analytics opt-out:</strong> Google offers a browser add-on that disables Analytics across all sites.</li>
  <li><strong>Private windows:</strong> cookies and site storage are discarded when the window closes.</li>
</ul>
<p>Blocking everything will not break this site: it has no checkout, no login and no personalisation that depends on cookies.</p>
`,
    },
    {
      id: "third-parties",
      heading: "Third-party recipients",
      html: `
<p>Aggregated analytics data is processed by Google as described in the <a href="/privacy-policy/">Privacy Policy</a>. Static hosting is provided by GitHub Pages. Google Search Console is used to monitor how the site appears in search results; it reports aggregated data and does not read anything from your browser.</p>
`,
    },
    {
      id: "more",
      heading: "Where to read more",
      html: `
<p>The <a href="/privacy-policy/">Privacy Policy</a> covers the full picture including your rights and retention periods. Questions can go through the <a href="/contact/">contact page</a>. Some numbers from search performance monitoring may be described in writing on the <a href="/blog/">blog</a>.</p>
`,
    },
  ],
};

export const LEGAL_DOCUMENTS = [PRIVACY_POLICY, TERMS, COOKIE_POLICY];
