/**
 * ImageMagick helper: builds deterministic raster assets (logos, icons, profile
 * identity card, Open Graph cards) with no external services.
 *
 * Only drawing primitives are used (no SVG delegation) so the generated assets
 * are reproducible on any machine that has ImageMagick 6/7 installed.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export const BRAND = {
  bg: "#0a0a0a",
  panel: "#101010",
  grid: "#161616",
  gridStrong: "#1d1d1d",
  ink: "#E8E4DC",
  inkDim: "#9d9a93",
  accent: "#00f0ff",
  accentSoft: "#7de8ff",
  amber: "#ffb454",
  green: "#5ff0a8",
};

export const FONT = {
  bold: "DejaVu-Sans-Bold",
  sans: "DejaVu-Sans",
  mono: "DejaVu-Sans-Mono",
  monoBold: "DejaVu-Sans-Mono-Bold",
};

/** Approximate advance width per character, as a fraction of the font size. */
const CHAR_RATIO = { bold: 0.62, sans: 0.58, mono: 0.6, monoBold: 0.6 };

export function textWidth(text, size, font = "bold") {
  const ratio = CHAR_RATIO[font] ?? 0.6;
  return Math.round(text.length * size * ratio);
}

/** Greedy word wrap that respects an approximate pixel budget. */
export function wrapText(text, size, maxWidth, font = "bold") {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (textWidth(candidate, size, font) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
  mkdirSync(path.endsWith("/") ? path : path, { recursive: true });
}

function drawLines(x0, y0, x1, y1, step) {
  const parts = [];
  for (let x = x0; x <= x1; x += step) parts.push(`line ${x},${y0} ${x},${y1}`);
  for (let y = y0; y <= y1; y += step) parts.push(`line ${x0},${y} ${x1},${y}`);
  return parts.join(" ");
}

/**
 * Render a technical background: dark canvas, faint grid, brighter accent rule.
 */
export function backgroundArgs({ width, height, grid = 40, accentBar = true }) {
  const args = [
    "-size",
    `${width}x${height}`,
    `xc:${BRAND.bg}`,
    "-stroke",
    BRAND.grid,
    "-strokewidth",
    "1",
    "-fill",
    "none",
    "-draw",
    drawLines(0, 0, width, height, grid),
    "-stroke",
    BRAND.gridStrong,
    "-draw",
    `line ${Math.round(width * 0.5)},0 ${Math.round(width * 0.5)},${height} line 0,${Math.round(
      height * 0.5,
    )} ${width},${Math.round(height * 0.5)}`,
  ];
  if (accentBar) {
    args.push("-stroke", "none", "-fill", BRAND.accent, "-draw", `rectangle 0,0 8,${height}`);
  }
  return args;
}

/**
 * Compose an Open Graph card (1200×630 by default).
 * Every card carries: eyebrow, title, optional subtitle, footer and wordmark.
 */
export function ogCard({ width = 1200, height = 630, eyebrow = "", title, subtitle = "", footer = "" }) {
  const pad = 72;
  const titleSize = title.length > 74 ? 52 : title.length > 46 ? 60 : 68;
  const lines = wrapText(title, titleSize, width - pad * 2 - 90, "bold");
  const titleTop = subtitle ? height / 2 - 40 : height / 2 + 10;

  const args = [
    ...backgroundArgs({ width, height, grid: 40 }),
    // accent rule above the title
    "-stroke",
    "none",
    "-fill",
    BRAND.accent,
    "-draw",
    `rectangle ${pad},${titleTop - 74} ${pad + 116},${titleTop - 70}`,
    // eyebrow
    "-font",
    FONT.mono,
    "-pointsize",
    "20",
    "-fill",
    BRAND.accentSoft,
    "-annotate",
    `+${pad}+${titleTop - 104}`,
    eyebrow.toUpperCase(),
    // title
    "-font",
    FONT.bold,
    "-pointsize",
    String(titleSize),
    "-fill",
    BRAND.ink,
  ];

  lines.forEach((line, index) => {
    args.push("-annotate", `+${pad}+${titleTop + index * (titleSize + 14)}`, line);
  });

  const afterTitle = titleTop + lines.length * (titleSize + 14);

  if (subtitle) {
    args.push(
      "-font",
      FONT.sans,
      "-pointsize",
      "26",
      "-fill",
      BRAND.inkDim,
      "-annotate",
      `+${pad}+${afterTitle + 22}`,
      wrapText(subtitle, 26, width - pad * 2 - 120, "sans")[0],
    );
  }

  // footer rule + labels
  args.push(
    "-stroke",
    BRAND.gridStrong,
    "-strokewidth",
    "2",
    "-draw",
    `line ${pad},${height - 92} ${width - pad},${height - 92}`,
    "-stroke",
    "none",
    "-font",
    FONT.mono,
    "-pointsize",
    "20",
    "-fill",
    BRAND.inkDim,
    "-annotate",
    `+${pad}+${height - 50}`,
    footer,
    "-font",
    FONT.monoBold,
    "-pointsize",
    "20",
    "-fill",
    BRAND.accent,
    "-annotate",
    `+${width - pad - textWidth("THOMU // OPERATOR", 20, "monoBold")}+${height - 50}`,
    "THOMU // OPERATOR",
  );

  return args;
}

/** Rounded-square brand tile with a hexagon mark and monogram letters. */
export function brandTile({ size, letters, sub = "", tile = "#0d0d0d" }) {
  const r = size * 0.22;
  const hexR = size * 0.27;
  const cx = size / 2;
  const cy = size * 0.42;
  const points = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${Math.round(cx + hexR * Math.cos(a))},${Math.round(cy + hexR * Math.sin(a))}`;
  }).join(" ");

  return [
    "-size",
    `${size}x${size}`,
    "xc:none",
    "-fill",
    tile,
    "-stroke",
    BRAND.gridStrong,
    "-strokewidth",
    String(Math.max(2, size * 0.012)),
    "-draw",
    `roundrectangle 0,0 ${size - 1},${size - 1} ${r},${r}`,
    "-stroke",
    BRAND.accent,
    "-fill",
    "none",
    "-strokewidth",
    String(Math.max(2, size * 0.018)),
    "-draw",
    `polygon ${points}`,
    "-stroke",
    "none",
    "-fill",
    BRAND.ink,
    "-font",
    FONT.bold,
    "-pointsize",
    String(Math.round(size * (letters.length > 2 ? 0.155 : 0.24))),
    "-gravity",
    "north",
    "-annotate",
    `+0+${Math.round(size * 0.345)}`,
    letters,
    "-font",
    FONT.mono,
    "-pointsize",
    String(Math.round(size * 0.052)),
    "-fill",
    BRAND.accentSoft,
    "-annotate",
    `+0+${Math.round(size * 0.745)}`,
    sub,
    "-gravity",
    "northwest",
  ];
}

/** The profile / identity card: monogram, name plate and disclosure line. */
export function profileCard({ size = 1200 }) {
  const pad = Math.round(size * 0.07);
  return [
    ...backgroundArgs({ width: size, height: size, grid: Math.round(size / 16) }),
    "-stroke",
    BRAND.gridStrong,
    "-fill",
    "#0d0d0d",
    "-strokewidth",
    "3",
    "-draw",
    `roundrectangle ${pad},${pad} ${size - pad},${size - pad} 24,24`,
    "-stroke",
    "none",
    "-fill",
    BRAND.accent,
    "-draw",
    `rectangle ${pad},${pad} ${size - pad},${pad + 10}`,
    "-font",
    FONT.mono,
    "-pointsize",
    String(Math.round(size * 0.026)),
    "-fill",
    BRAND.accentSoft,
    "-annotate",
    `+${pad + 44}+${pad + 84}`,
    "IDENTITY // PLACEHOLDER",
    "-font",
    FONT.bold,
    "-pointsize",
    String(Math.round(size * 0.2)),
    "-fill",
    BRAND.ink,
    "-annotate",
    `+${pad + 38}+${Math.round(size * 0.5)}`,
    "GST",
    "-font",
    FONT.sans,
    "-pointsize",
    String(Math.round(size * 0.052)),
    "-fill",
    BRAND.ink,
    "-annotate",
    `+${pad + 44}+${Math.round(size * 0.6)}`,
    "George S. Thomas",
    "-font",
    FONT.mono,
    "-pointsize",
    String(Math.round(size * 0.032)),
    "-fill",
    BRAND.inkDim,
    "-annotate",
    `+${pad + 44}+${Math.round(size * 0.65)}`,
    "THOMU · THODUPUZHA, KERALA",
    "-stroke",
    BRAND.gridStrong,
    "-strokewidth",
    "2",
    "-draw",
    `line ${pad + 44},${size - pad - 62} ${size - pad - 44},${size - pad - 62}`,
    "-stroke",
    "none",
    "-font",
    FONT.sans,
    "-pointsize",
    String(Math.round(size * 0.03)),
    "-fill",
    BRAND.inkDim,
    "-annotate",
    `+${pad + 44}+${size - pad - 26}`,
    "Replace with a real portrait — see assets/README.md",
  ];
}

/** Run ImageMagick and fail loudly. */
export function magick(args, label = "convert") {
  try {
    execFileSync("convert", args, { stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().slice(0, 800) : "";
    throw new Error(`ImageMagick failed (${label})\n${stderr}`);
  }
}

export function magickIdentify(args) {
  return execFileSync("identify", args, { encoding: "utf8" }).trim();
}
