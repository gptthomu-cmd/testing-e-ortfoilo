/**
 * Regenerate every raster asset in public/images:
 *
 *   1. masters   — brand marks, monogram icon, profile identity card
 *   2. variants  — responsive widths in AVIF + WebP + fallback JPEG/PNG
 *   3. favicons  — favicon.ico (16/32/48), apple-touch-icon, PWA icons
 *   4. OG cards  — one 1200×630 social card per page, from assets/og-cards.json
 *
 * Run:  npm run images:build
 * Requires ImageMagick (`convert` + `identify`).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BRAND,
  FONT,
  magick,
  ogCard,
  brandTile,
  profileCard,
  backgroundArgs,
  textWidth,
  wrapText,
} from "./lib/im.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const spec = JSON.parse(readFileSync(join(root, "assets/images.json"), "utf8"));
const ogCards = JSON.parse(readFileSync(join(root, "assets/og-cards.json"), "utf8"));
const publicDir = join(root, "public");

const written = [];
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

function writeOutput(relPath, contents) {
  const abs = join(publicDir, relPath);
  mkdirSync(join(abs, ".."), { recursive: true });
  writeFileSync(abs, contents);
  written.push({ path: `public${relPath}`, size: statSync(abs).size });
  return abs;
}

/* -------------------------------------------------------------------------- */
/*  1. Masters                                                                */
/* -------------------------------------------------------------------------- */
console.log("→ masters");

mkdirSync(join(root, "assets/masters"), { recursive: true });

const masters = {
  "nkt-group-logo.png": () =>
    magick([...brandTile({ size: 1024, letters: "NKT", sub: "GROUP SINCE 1947" }), join(root, "assets/masters/nkt-group-logo.png")], "nkt-group-logo"),
  "site-icon.png": () =>
    magick([...brandTile({ size: 1024, letters: "GST", sub: "THOMU" }), join(root, "assets/masters/site-icon.png")], "site-icon"),
  "profile-identity.png": () =>
    magick([...profileCard({ size: 1200 }), join(root, "assets/masters/profile-identity.png")], "profile-identity"),
};

for (const [file, build] of Object.entries(masters)) {
  if (!existsSync(join(root, "assets/masters", file)) || process.env.FORCE_MASTERS === "1") build();
}

/* -------------------------------------------------------------------------- */
/*  2. Responsive variants                                                    */
/* -------------------------------------------------------------------------- */
console.log("→ responsive variants");

const RENDER_OPTIONS = {
  avif: ["-quality", "58"],
  webp: ["-quality", "80"],
  jpg: ["-quality", "82", "-interlace", "Plane", "-sampling-factor", "4:2:0"],
  png: ["-strip"],
};

function buildVariants(entry) {
  const master = join(root, entry.master);
  if (!existsSync(master)) throw new Error(`Missing master: ${entry.master}`);
  const { width: srcW, height: srcH } = readSize(master);
  const isSquare = srcW === srcH;

  for (const width of entry.widths) {
    const height = isSquare ? width : Math.round((width * srcH) / srcW);
    for (const format of ["avif", "webp", entry.format]) {
      const out = `${entry.out}-${width}.${format}`;
      const target = join(publicDir, out);
      mkdirSync(join(target, ".."), { recursive: true });
      const args = [
        master,
        "-resize",
        `${width}x${height}`,
        "-strip",
        ...RENDER_OPTIONS[format],
        target,
      ];
      magick(args, `${basename(out)}`);
      written.push({ path: `public${out}`, size: statSync(join(publicDir, out)).size });
    }
  }
}

function readSize(file) {
  const out = execFileSync("identify", ["-format", "%w %h", file], { encoding: "utf8" }).trim();
  const [w, h] = out.split(/\s+/).map(Number);
  return { width: w, height: h };
}

for (const entry of [...Object.values(spec.brand), ...Object.values(spec.profile)]) {
  buildVariants(entry);
}

/* -------------------------------------------------------------------------- */
/*  3. Icons                                                                  */
/* -------------------------------------------------------------------------- */
console.log("→ favicons + PWA icons");

const iconMaster = join(root, "assets/masters/site-icon.png");
magick([iconMaster, "-define", "icon:auto-resize=48,32,16", join(publicDir, "favicon.ico")], "favicon.ico");
written.push({ path: "public/favicon.ico", size: statSync(join(publicDir, "favicon.ico")).size });

// apple-touch-icon: single size, flattened onto the brand background.
magick(
  [iconMaster, "-resize", "180x180", "-background", BRAND.bg, "-alpha", "remove", "-alpha", "off", join(publicDir, "apple-touch-icon.png")],
  "apple-touch-icon",
);
written.push({ path: "public/apple-touch-icon.png", size: statSync(join(publicDir, "apple-touch-icon.png")).size });

// maskable icon needs a safe zone: content inset to ~60% of the canvas.
mkdirSync(join(publicDir, "icons"), { recursive: true });
magick(
  ["-size", "512x512", `xc:${BRAND.bg}`, iconMaster, "-resize", "320x320", "-gravity", "center", "-composite", join(publicDir, "icons/maskable-512.png")],
  "maskable-512",
);
written.push({ path: "public/icons/maskable-512.png", size: statSync(join(publicDir, "icons/maskable-512.png")).size });

// Vector brand marks (hand-written SVG, tiny and crisp at any size).
writeOutput("/images/brand/logo-lockup.svg", lockupSvg());
writeOutput("/images/brand/monogram.svg", monogramSvg());

// Technical diagrams used as in-article figures. Hand-authored SVG: no external
// fonts or images, so they render identically everywhere and weigh ~3 kB.
writeOutput("/images/generated/charging-bay-diagram.svg", chargingBayDiagramSvg());
writeOutput("/images/generated/rack-diagram.svg", rackDiagramSvg());

/* -------------------------------------------------------------------------- */
/*  4. Open Graph cards                                                       */
/* -------------------------------------------------------------------------- */
console.log("→ open graph cards");

for (const card of ogCards.cards) {
  const out = join(publicDir, card.out.replace(/^\//, ""));
  mkdirSync(join(out, ".."), { recursive: true });
  magick(
    [...ogCard({ eyebrow: card.eyebrow, title: card.title, subtitle: card.subtitle, footer: card.footer }), "-quality", "84", "-interlace", "Plane", out],
    basename(out),
  );
  written.push({ path: `public${card.out}`, size: statSync(out).size });
}

/* -------------------------------------------------------------------------- */
/*  Report                                                                    */
/* -------------------------------------------------------------------------- */
const total = written.reduce((sum, f) => sum + f.size, 0);
console.log(`\n✓ ${written.length} files, ${kb(total)} total`);
for (const file of written) console.log(`  ${kb(file.size).padStart(9)}  ${file.path}`);

/* -------------------------------------------------------------------------- */
/*  Inline SVG brand marks                                                    */
/* -------------------------------------------------------------------------- */
function lockupSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 96" role="img" aria-label="THOMU // OPERATOR">
  <title>THOMU // OPERATOR</title>
  <rect width="520" height="96" fill="none"/>
  <polygon points="48,14 82,34 82,74 48,94 14,74 14,34" fill="none" stroke="#00f0ff" stroke-width="3"/>
  <text x="48" y="62" font-family="DejaVu Sans, Verdana, sans-serif" font-size="26" font-weight="700" fill="#E8E4DC" text-anchor="middle">GST</text>
  <text x="104" y="46" font-family="DejaVu Sans Mono, monospace" font-size="26" font-weight="700" fill="#E8E4DC">THOMU</text>
  <text x="104" y="74" font-family="DejaVu Sans Mono, monospace" font-size="15" fill="#00f0ff">// OPERATOR</text>
</svg>
`;
}

/** Block diagram: what sits between the grid and a charging bay. */
function chargingBayDiagramSvg() {
  const box = (x, y, w, h, title, sub, accent = false) => `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"
            fill="#101010" stroke="${accent ? "#00f0ff" : "#1d1d1d"}" stroke-width="${accent ? 2 : 1.5}"/>
      <text x="${x + 18}" y="${y + 34}" font-family="DejaVu Sans, Verdana, sans-serif" font-size="19"
            font-weight="700" fill="#e8e4dc">${title}</text>
      <text x="${x + 18}" y="${y + 60}" font-family="DejaVu Sans Mono, monospace" font-size="14"
            fill="#9d9a93">${sub}</text>
    </g>`;
  const arrow = (x1, y1, x2, y2, label = "") => `
    <g>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#00f0ff" stroke-width="2"
            marker-end="url(#arrowhead)"/>
      ${label ? `<text x="${(x1 + x2) / 2}" y="${y1 - 12}" text-anchor="middle"
            font-family="DejaVu Sans Mono, monospace" font-size="13" fill="#7de8ff">${label}</text>` : ""}
    </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 620" role="img"
     aria-label="Block diagram of a public charging bay: grid supply, metering, power modules, charge controller, bays and monitoring">
  <title>How a public charging bay is put together</title>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0,0 10,4 0,8" fill="#00f0ff"/>
    </marker>
  </defs>
  <rect width="1200" height="620" fill="#0a0a0a"/>
  <g stroke="#161616" stroke-width="1">
    ${Array.from({ length: 29 }, (_, i) => `<line x1="${(i + 1) * 40}" y1="0" x2="${(i + 1) * 40}" y2="620"/>`).join("\n    ")}
    ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${(i + 1) * 40}" x2="1200" y2="${(i + 1) * 40}"/>`).join("\n    ")}
  </g>
  <text x="48" y="56" font-family="DejaVu Sans Mono, monospace" font-size="16" fill="#00f0ff">
    NKT CHARGE HUB // POWER PATH
  </text>
  ${box(48, 120, 240, 100, "Grid supply", "LV feeder · sanctioned load")}
  ${box(358, 120, 240, 100, "Metering &amp; protection", "Meter · RCD · surge arrestor")}
  ${box(668, 120, 240, 100, "Power modules", "AC → DC conversion", true)}
  ${box(978, 120, 174, 100, "Charge bay", "CCS2 · up to 120 kW", true)}
  ${arrow(288, 170, 358, 170)}
  ${arrow(598, 170, 668, 170)}
  ${arrow(908, 170, 978, 170)}
  ${box(668, 320, 240, 100, "Charge controller", "OCPP session control", true)}
  ${arrow(788, 220, 788, 320)}
  ${box(358, 320, 240, 100, "Edge monitor", "Pi node · MQTT · local buffer")}
  ${arrow(598, 370, 668, 370, "telemetry")}
  ${box(358, 486, 240, 90, "Network partner", "IonGrid · roaming &amp; payments")}
  ${arrow(478, 486, 478, 420)}
  ${box(978, 320, 174, 100, "Vehicle", "BMS handshake")}
  ${arrow(978, 370, 918, 370)}
  <text x="48" y="582" font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#6f6c67">
    Monitoring is not an add-on layer; it is wired to the same controller that starts a session.
  </text>
</svg>
`;
}

/** Layered rack diagram: power, storage, compute, network — plus remote replica. */
function rackDiagramSvg() {
  const layer = (y, label, detail, accent = false) => `
    <g>
      <rect x="60" y="${y}" width="700" height="78" rx="10" fill="#101010"
            stroke="${accent ? "#00f0ff" : "#1d1d1d"}" stroke-width="${accent ? 2 : 1.5}"/>
      <text x="84" y="${y + 32}" font-family="DejaVu Sans, Verdana, sans-serif" font-size="19"
            font-weight="700" fill="#e8e4dc">${label}</text>
      <text x="84" y="${y + 58}" font-family="DejaVu Sans Mono, monospace" font-size="14"
            fill="#9d9a93">${detail}</text>
    </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 620" role="img"
     aria-label="Rack diagram showing power, storage, compute and network layers with an off-rack replica">
  <title>Homelab rack layers by failure domain</title>
  <defs>
    <marker id="arrowhead2" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0,0 10,4 0,8" fill="#5ff0a8"/>
    </marker>
  </defs>
  <rect width="1200" height="620" fill="#0a0a0a"/>
  <g stroke="#161616" stroke-width="1">
    ${Array.from({ length: 29 }, (_, i) => `<line x1="${(i + 1) * 40}" y1="0" x2="${(i + 1) * 40}" y2="620"/>`).join("\n    ")}
    ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${(i + 1) * 40}" x2="1200" y2="${(i + 1) * 40}"/>`).join("\n    ")}
  </g>
  <text x="48" y="56" font-family="DejaVu Sans Mono, monospace" font-size="16" fill="#00f0ff">
    THOMU LAB // RACK LAYERS BY FAILURE DOMAIN
  </text>
  ${layer(100, "1 · Power", "UPS sized for orderly shutdown · surge protection · tested hookup", true)}
  ${layer(196, "2 · Storage", "ZFS pool · ECC RAM · monthly scrub · snapshots before change", true)}
  ${layer(292, "3 · Compute", "Edge nodes · telemetry buffers · agent workloads")}
  ${layer(388, "4 · Network", "Switch · private mesh for remote access · offline-first buffering")}
  ${layer(484, "5 · Environment", "Temperature and humidity sensing · dry-cabinet for optics")}
  <g>
    <rect x="840" y="196" width="312" height="272" rx="10" fill="#101010" stroke="#1d1d1d" stroke-width="1.5"/>
    <text x="864" y="232" font-family="DejaVu Sans, Verdana, sans-serif" font-size="19" font-weight="700" fill="#e8e4dc">
      Off-rack replica
    </text>
    <text x="864" y="264" font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#9d9a93">
      replicated snapshots
    </text>
    <text x="864" y="300" font-family="DejaVu Sans, Verdana, sans-serif" font-size="17" fill="#e8e4dc">
      A pool is not a backup.
    </text>
    <text x="864" y="332" font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#6f6c67">
      restore tested quarterly
    </text>
    <text x="864" y="368" font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#6f6c67">
      runbook written while healthy
    </text>
    <line x1="760" y1="288" x2="840" y2="288" stroke="#5ff0a8" stroke-width="2" marker-end="url(#arrowhead2)"/>
  </g>
  <text x="48" y="596" font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#6f6c67">
    Each layer alarms independently, so a failed PSU is visible before it becomes a dead pool.
  </text>
</svg>
`;
}

function monogramSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="George S. Thomas monogram">
  <title>George S. Thomas monogram</title>
  <rect width="512" height="512" rx="112" fill="#0a0a0a"/>
  <g stroke="#1d1d1d" stroke-width="1">
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${(i + 1) * 40}" y1="0" x2="${(i + 1) * 40}" y2="512"/>`).join("\n    ")}
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${(i + 1) * 40}" x2="512" y2="${(i + 1) * 40}"/>`).join("\n    ")}
  </g>
  <polygon points="256,88 396,168 396,344 256,424 116,344 116,168" fill="none" stroke="#00f0ff" stroke-width="8"/>
  <text x="256" y="290" font-family="DejaVu Sans, Verdana, sans-serif" font-size="120" font-weight="700" fill="#E8E4DC" text-anchor="middle">GST</text>
  <text x="256" y="356" font-family="DejaVu Sans Mono, monospace" font-size="34" fill="#7de8ff" text-anchor="middle">THOMU</text>
</svg>
`;
}
