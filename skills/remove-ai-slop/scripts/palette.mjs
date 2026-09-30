#!/usr/bin/env node
// Palette tool: list, suggest, print ready-to-paste tokens, and verify WCAG contrast.
// Zero dependencies. Node 18+.
//
//   node palette.mjs                         list every palette
//   node palette.mjs --suggest "dental clinic"   rank palettes for a brief
//   node palette.mjs <id>                    CSS tokens (light + dark) + contrast report
//   node palette.mjs <id> --tailwind         Tailwind v4 @theme block
//   node palette.mjs <id> --tailwind3        Tailwind v3 theme.extend.colors
//   node palette.mjs --check                 verify every palette, exit 1 on failure
//   node palette.mjs --contrast "#555963" "#FAFAFA"

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const palettes = JSON.parse(readFileSync(join(here, "../reference/palettes.json"), "utf8"));
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);

function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Bad hex: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Required pairs. Body text gets AAA, secondary text and button labels get AA.
const RULES = [
  ["ink", "bg", 7, "body text on page"],
  ["ink", "surface", 7, "body text on cards"],
  ["muted", "bg", 4.5, "secondary text on page"],
  ["muted", "surface", 4.5, "secondary text on cards"],
  ["on-accent", "accent", 4.5, "button label on accent"],
];

function checkMode(tokens) {
  const results = RULES.map(([fg, bg, min, what]) => {
    const ratio = contrast(tokens[fg], tokens[bg]);
    return { pair: `${fg} / ${bg}`, ratio, min, what, pass: ratio >= min };
  });
  // Accent as foreground is informational: it decides where the accent may be used.
  const a = contrast(tokens.accent, tokens.bg);
  const accentUse = a >= 4.5 ? "text-safe (links, small text, icons)" : a >= 3 ? "large text, icons, UI strokes only" : "fill only (buttons, badges, blocks). Never use as text color";
  return { results, accentRatio: a, accentUse };
}

function report(id) {
  const p = palettes[id];
  let ok = true;
  for (const mode of ["light", "dark"]) {
    const { results, accentRatio, accentUse } = checkMode(p[mode]);
    console.log(`\n/* ${p.name} . ${mode} */`);
    for (const r of results) {
      if (!r.pass) ok = false;
      console.log(`/*  ${r.pass ? "PASS" : "FAIL"}  ${r.pair.padEnd(22)} ${r.ratio.toFixed(2).padStart(5)}:1  (need ${r.min}, ${r.what}) */`);
    }
    console.log(`/*  INFO  accent / bg              ${accentRatio.toFixed(2).padStart(5)}:1  accent is ${accentUse} */`);
  }
  return ok;
}

const vars = (t, indent = "  ") => Object.entries(t).map(([k, v]) => `${indent}--${k}: ${v};`).join("\n");

const DERIVED = `  --accent-soft: color-mix(in oklab, var(--accent) 12%, var(--bg));
  --ring: color-mix(in oklab, var(--accent) 55%, transparent);
  --shadow-sm: 0 1px 2px color-mix(in oklab, var(--ink) 6%, transparent);
  --shadow-lg: 0 1px 2px color-mix(in oklab, var(--ink) 5%, transparent), 0 12px 32px -12px color-mix(in oklab, var(--ink) 18%, transparent);`;

function css(id) {
  const p = palettes[id];
  return `/* ${p.name} . ${p.mood} . fonts: ${p.fonts} (see reference/fonts.md) */
:root {
  color-scheme: light;
${vars(p.light)}
${DERIVED}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${vars(p.dark, "    ")}
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;
${vars(p.dark)}
}

::selection { background: var(--accent); color: var(--on-accent); }
:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }`;
}

const SLOTS = ["bg", "surface", "ink", "muted", "border", "accent", "on-accent", "accent-soft"];

function tailwind4() {
  return `@import "tailwindcss";

/* Paste the :root blocks from \`node palette.mjs <id>\` above this line. */
@theme inline {
${SLOTS.map((s) => `  --color-${s}: var(--${s});`).join("\n")}
}
/* Utilities: bg-bg, bg-surface, text-ink, text-muted, border-border, bg-accent, text-on-accent, bg-accent-soft */`;
}

function tailwind3() {
  return `// tailwind.config.js . theme.extend.colors (paste the :root CSS blocks into your global stylesheet)
colors: {
${SLOTS.map((s) => `  "${s}": "var(--${s})",`).join("\n")}
},`;
}

function list() {
  console.log("Palettes (node palette.mjs <id> for tokens):\n");
  for (const [id, p] of Object.entries(palettes)) {
    console.log(`  ${id.padEnd(18)} ${p.name.padEnd(18)} ${p.fits.join(", ")}`);
  }
}

function suggest(brief) {
  const words = brief.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2);
  const scored = Object.entries(palettes).map(([id, p]) => {
    const hay = `${p.fits.join(" ")} ${p.mood}`.toLowerCase();
    const score = words.reduce((s, w) => s + (hay.includes(w) || hay.includes(w.replace(/s$/, "")) ? 1 : 0), 0);
    return { id, p, score };
  }).sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, 3);
  if (!top.length) {
    console.log("No direct match. Pick by mood instead:\n");
    return list();
  }
  for (const { id, p } of top) console.log(`  ${id.padEnd(18)} ${p.mood.padEnd(40)} fonts: ${p.fonts}`);
}

// ---- main
if (flag("--contrast")) {
  const [a, b] = args.filter((x) => x.startsWith("#"));
  const r = contrast(a, b);
  console.log(`${a} on ${b}: ${r.toFixed(2)}:1  ${r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA large text / UI only" : "FAIL"}`);
  process.exit(r >= 4.5 ? 0 : 1);
} else if (flag("--check")) {
  let ok = true;
  for (const id of Object.keys(palettes)) ok = report(id) && ok;
  console.log(ok ? "\nAll palettes pass." : "\nSome pairs FAIL.");
  process.exit(ok ? 0 : 1);
} else if (flag("--suggest")) {
  suggest(args.filter((a) => a !== "--suggest").join(" "));
} else if (args[0] && !args[0].startsWith("--")) {
  const id = args[0];
  if (!palettes[id]) {
    console.error(`Unknown palette "${id}".`);
    list();
    process.exit(1);
  }
  if (flag("--tailwind")) console.log(tailwind4());
  else if (flag("--tailwind3")) console.log(tailwind3());
  else {
    console.log(css(id));
    process.exit(report(id) ? 0 : 1);
  }
} else {
  list();
}
