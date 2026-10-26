# Security headers & CSP

Everything in this document is already wired up. `public/_headers` holds the
rules, and the build fills them in. Read this if you move hosts, or if you
wonder why a change to the HTML broke a script.

---

## 1. How it works

```
public/_headers          the rules (Netlify / Cloudflare Pages syntax)
        │
        │  npm run build
        ▼
dist/_headers            the same rules, with the security block expanded
                         and the CSP script hashes computed from your HTML
```

Every path rule in `public/_headers` carries a marker line:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
  # [security]
```

The `securityHeaders` plugin in `vite.config.js` replaces each marker with the
full block — `nosniff`, `Referrer-Policy`, `X-Frame-Options`, HSTS,
`Permissions-Policy`, the cross-origin pair, and the CSP. It also logs what it
did:

```
[security] CSP with 18 script hash(es) applied to 13 header rule(s)
```

**Why the block is repeated in every rule.** Hosts disagree, and have changed
over time, about what happens when two rules match the same path: some apply
only the first match, others merge them. Repeating the block makes the result
identical either way.

**Why the hashes are computed at build time.** The site has inline scripts —
the JSON-LD on every page and two small bootstrap snippets. Allowing
`'unsafe-inline'` would let any injected script run too, which makes a CSP
mostly decorative. Instead each inline script is hashed with SHA-256 and listed
in `script-src`, so only scripts this build produced can execute. Edit an
inline script and the next build writes a new hash automatically. If you add an
inline script by hand and forget to rebuild, the browser blocks it and logs the
hash it wanted in the console — that is the system working, not a bug.

---

## 2. The policy, explained

| Directive | Value | Why |
|---|---|---|
| `default-src` | `'self'` | Everything not named below is same-origin only. |
| `script-src` | `'self'` + hashes + `googletagmanager.com` | Hashes for the inline scripts; the GA host so analytics can load *after consent*. |
| `style-src` | `'self' 'unsafe-inline'` | CSS is bundled; a handful of decorative `style="…"` attributes need inline. |
| `img-src` | `'self' data: google-analytics.com` | Local images; `data:` for the tiny inline SVG placeholders; GA's collection beacon. |
| `font-src` | `'self'` | Fonts are self-hosted — nothing is fetched from Google Fonts. |
| `connect-src` | `'self'` + GA endpoints | GA4 beacons, plus nothing else. |
| `frame-src` | `'none'` | The site embeds no frames at all. |
| `frame-ancestors` | `'self'` | Nobody else may put this site in an iframe (clickjacking). |
| `base-uri` | `'self'` | Blocks injected `<base>` tags that would repoint every relative URL. |
| `form-action` | `'self'` | There is no form; nothing may be posted anywhere. |
| `object-src` | `'none'` | No legacy plugins. |
| `upgrade-insecure-requests` | — | Any stray `http://` subresource is fetched over HTTPS. |

Plus, on every response:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (the legacy twin of `frame-ancestors`)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera, microphone, geolocation, payment, USB, MIDI
  and the rest are denied to everyone, including this site
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

### Two deliberate choices

- **`frame-ancestors 'self'` rather than `'none'`.** `'none'` is stricter, but
  it also breaks previewing your own deployed site inside any tool that
  iframes it. Nothing on this site can be clickjacked (there are no
  authenticated actions), so `'self'` costs nothing.
- **HSTS `preload` is already set.** It is hard to undo — a browser that has
  the pin will insist on HTTPS for two years. Keep it only if you are certain
  every subdomain will serve HTTPS forever. To back out, remove `preload` and
  submit a removal request at hstspreload.org.

---

## 3. If you move hosts

### nginx

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Permissions-Policy "accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=(), xr-spatial-tracking=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
add_header Content-Security-Policy "…copy the generated line from dist/_headers…" always;
```

Copy the exact CSP line out of `dist/_headers` after a build — do not retype
the hashes.

### Apache

```apache
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
Header always set Cross-Origin-Opener-Policy "same-origin"
Header always set Cross-Origin-Resource-Policy "same-origin"
Header always set Content-Security-Policy "…from dist/_headers…"
```

### Vercel / GitHub Pages

Neither reads `_headers`. Use `vercel.json` (Vercel) or a Cloudflare proxy
(GitHub Pages) with the same values.

---

## 4. Checking it

```bash
curl -sI https://georgesthomas.com/ | grep -i 'content-security\|strict-transport\|permissions'
```

Then paste the URL into <https://securityheaders.io>. The one thing that
scanner cannot tell you is whether the CSP *breaks* anything — so after any
HTML change, open the console on a deployed page. A blocked script prints the
hash it expected; if that happens after an edit, run `npm run build` and
redeploy.

---

## 5. Also part of "secure"

- `/.well-known/security.txt` (RFC 9116) — how to report a problem. Update the
  `Expires:` line yearly; every entry expires and stale entries are ignored.
- `/humans.txt` — who built the site and what it is made of.
- `/privacy/` and `/terms/` — what is collected (almost nothing) and what is
  never published.
- No contact form, no login, no database, no user input: the attack surface is
  a set of static files.

## 6. Security of *content*

The privacy rule of this site is a security rule too: no bank or card numbers,
no credentials, no private addresses, no CCTV or server logins, no private
contracts or financials are ever in these files. Nothing sensitive lives in the
repository, so nothing sensitive can leak from it — see `docs/CONTENT.md`.
