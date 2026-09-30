#!/usr/bin/env node
// slop-check: find the patterns that make a website look AI-generated.
// Zero dependencies. Node 18+.
// slop-ignore-file: this script contains every pattern it searches for, so it skips itself.
//
//   node slop-check.mjs [dir]            scan (default: current dir)
//   node slop-check.mjs [dir] --strict   warnings also fail (exit 1)
//   node slop-check.mjs [dir] --fix-dashes   rewrite em/en dashes in place, then re-scan
//
// Ignore a line: put "slop-ignore" anywhere on it.
// Ignore a file: put "slop-ignore-file" anywhere in it.

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith("--")) || ".";
const STRICT = args.includes("--strict");
const FIX = args.includes("--fix-dashes");

const EXTS = new Set([".html", ".htm", ".jsx", ".tsx", ".js", ".ts", ".mjs", ".vue", ".svelte", ".astro", ".md", ".mdx", ".css", ".scss", ".json", ".liquid", ".njk", ".hbs", ".php", ".erb"]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", ".output", ".svelte-kit", ".vercel", ".netlify", "coverage", "out", ".turbo", ".cache", "vendor", ".astro"]);
const SKIP_FILES = /^(package(-lock)?\.json|pnpm-lock\.yaml|yarn\.lock|tsconfig.*\.json|jsconfig\.json|components\.json|.*\.min\.(js|css))$/;
const MARKUP = new Set([".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".mdx", ".liquid", ".njk", ".hbs", ".php", ".erb"]);
const STYLE = new Set([".css", ".scss"]);
const CODE_OR_MARKUP = new Set([...MARKUP, ".js", ".ts", ".mjs", ...STYLE]);

// Dash characters are written as escapes so this file never flags itself.
const EM = "\u2014";
const EN = "\u2013";

const RULES = {
  "em-dash": { level: "error", fix: "Rewrite the sentence with a period, comma, colon, or parentheses. Or run --fix-dashes, then reread every changed line." },
  "en-dash": { level: "error", fix: "Plain hyphen for number ranges (2019-2026). Words for time ranges (Mon to Fri)." },
  "placeholder": { level: "error", fix: "Placeholder content shipped. Use real names, emails, phone numbers, and copy." },
  "img-alt": { level: "error", fix: "Every <img> needs alt text. Use alt=\"\" only for purely decorative images." },
  "reduced-motion": { level: "error", fix: "Animations found but no prefers-reduced-motion handling anywhere. See reference/layout-motion.md." },
  "slop-words": { level: "warn", fix: "Generic AI marketing vocabulary. Say the concrete thing instead. See reference/copy.md." },
  "slop-phrases": { level: "warn", fix: "AI sentence pattern. Rewrite plainly." },
  "pure-black": { level: "warn", fix: "Pure black looks flat and harsh. Use a tinted near-black ink token." },
  "ai-gradient": { level: "warn", fix: "Purple/violet/indigo gradients are the default AI look. Use a same-hue brand gradient or none." },
  "gradient-text": { level: "warn", fix: "Gradient-filled headline text is an AI tell. Solid ink, emphasis through weight or italic." },
  "neon-glow": { level: "warn", fix: "Colored outer glows read as generated. Use tinted two-layer shadows or a border." },
  "transition-all": { level: "warn", fix: "List the properties you animate (transform, opacity). transition: all animates layout too." },
  "custom-cursor": { level: "warn", fix: "Hidden or custom cursors hurt usability and accessibility." },
  "sparkle-icon": { level: "warn", fix: "The sparkles icon is the universal 'AI made this' symbol. Pick an icon that means something here." },
  "emoji-ui": { level: "warn", fix: "Emoji in headings or buttons. Use a real icon set or nothing." },
  "placeholder-image": { level: "warn", fix: "Placeholder image service. Use real photos or generated assets." },
  "overused-font": { level: "warn", fix: "Default template font. See reference/fonts.md for pairings with more character." },
  "font-count": { level: "warn", fix: "More than 3 font families. Use one display + one body (+ optional mono)." },
  "eyebrow-overuse": { level: "warn", fix: "Small uppercase labels above too many headings. Max 1 per 3 sections." },
  "color-sprawl": { level: "warn", fix: "Many hardcoded hex colors outside the token file. Move them to CSS variables (node palette.mjs <id>)." },
};

const SLOP_WORDS = [
  "elevate", "elevates", "elevating", "unleash", "unleashes", "unlock", "unlocks", "unlocking", "empower", "empowers", "empowering",
  "supercharge", "supercharged", "revolutionize", "revolutionizes", "revolutionary", "leverage", "leverages", "leveraging",
  "harness", "streamline", "streamlined", "delve", "embark", "spearhead", "reimagine", "reimagined", "redefine", "redefining",
  "turbocharge", "skyrocket", "seamless", "seamlessly", "cutting-edge", "next-gen", "next-level", "state-of-the-art", "world-class",
  "best-in-class", "game-changing", "game-changer", "innovative", "robust", "holistic", "synergy", "synergistic", "unparalleled",
  "unmatched", "top-notch", "breathtaking", "tapestry", "testament", "realm",
];
const WORD_RE = new RegExp(`\\b(${SLOP_WORDS.map((w) => w.replace(/-/g, "\\-")).join("|")})\\b`, "i");

const PHRASES = [
  /\b(not|isn't|aren't|more than) just (a |an |the )?\w+/i,
  /\bit'?s not (a |an |about )?[\w ]{1,30}[.,;] it'?s\b/i,
  /\bin today'?s (fast-paced|digital|modern|ever-changing)/i,
  /\bin the digital age\b/i,
  /\blook no further\b/i,
  /\bto the next level\b/i,
  /\bwe'?ve got you covered\b/i,
  /\bone-stop[- ]shop\b/i,
  /\bwe'?re passionate about\b/i,
  /\bat the intersection of\b/i,
  /\bthe power of\b/i,
  /\bwhether you'?re an? [\w ]+ or an? /i,
];

const PLACEHOLDERS = [
  /lorem ipsum|dolor sit amet/i,
  /\b(John|Jane) (Doe|Smith)\b/,
  /\bAcme( Inc| Corp| Co)?\b/,
  /\bexample@example\.com\b|\byou@example\.com\b|\bjohn@doe\.com\b/i,
  /\b123-456-7890\b|\(555\) ?\d{3}-\d{4}|\b555-\d{4}\b/,
  /\bYour Company( Name)?\b|\bCompany Name\b/,
];

const OVERUSED_FONTS = ["poppins", "montserrat", "roboto", "open sans", "lato", "nunito", "space grotesk", "fraunces", "instrument serif", "playfair display"];
const GENERIC_FONTS = /^(system-ui|sans-serif|serif|monospace|cursive|fantasy|inherit|initial|ui-[\w-]+|-apple-system|blinkmacsystemfont|segoe ui|helvetica( neue)?|arial|georgia|times( new roman)?|courier( new)?|menlo|consolas|var\(.*)$/i;

// ---------- walk
const files = [];
(function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name) && !e.name.startsWith(".")) walk(p); continue; }
    if (!EXTS.has(extname(e.name).toLowerCase()) || SKIP_FILES.test(e.name)) continue;
    try { if (statSync(p).size > 1_000_000) continue; } catch { continue; }
    files.push(p);
  }
})(root);

// ---------- fix dashes
const RANGE = "\\d[\\w:.]*|(?:mon|tue|wed|thu|fri|sat|sun|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*";

function fixDashes(text) {
  let n = 0;
  const out = text.split("\n").map((line) => {
    if (line.includes("slop-ignore")) return line;
    const before = line;
    line = line
      .replace(/&mdash;|&#8212;|&#x2014;/gi, EM)
      .replace(/&ndash;|&#8211;|&#x2013;/gi, EN)
      .replace(new RegExp(`(\\d)[${EM}${EN}](\\d)`, "g"), "$1-$2")                  // 2019-2026
      .replace(new RegExp(`\\b(${RANGE})\\s*[${EM}${EN}]\\s*(${RANGE})\\b`, "gi"), "$1 to $2") // 9am to 5pm, Mon to Fri
      .replace(new RegExp(`(^\\s*|>\\s*)[${EM}${EN}]\\s*`, "g"), "$1")               // leading dash: "<cite>- Name"
      .replace(new RegExp(`(["'\u201D])\\s*[${EM}${EN}]\\s*`, "g"), "$1 ")            // quote attribution: "Great." Name
      .replace(new RegExp(`\\s*${EM}\\s*`, "g"), ", ")                                   // clause dash
      .replace(new RegExp(`\\s+${EN}\\s+`, "g"), ", ")
      .replace(new RegExp(EN, "g"), "-")
      .replace(/, ([.,;:!?])/g, "$1");
    if (line !== before) n++;
    return line;
  });
  return { text: out.join("\n"), n };
}

if (FIX) {
  let changedLines = 0, changedFiles = 0;
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    if (src.includes("slop-ignore-file")) continue;
    const { text, n } = fixDashes(src);
    if (n) { writeFileSync(f, text); changedLines += n; changedFiles++; console.log(`  fixed ${n} line(s)  ${relative(root, f)}`); }
  }
  console.log(`\nRewrote dashes on ${changedLines} line(s) in ${changedFiles} file(s). A comma is not always right: reread each one.\n`);
}

// ---------- scan
const findings = Object.fromEntries(Object.keys(RULES).map((k) => [k, []]));
const add = (rule, file, line, text) => findings[rule].push({ file: file ? relative(root, file) || basename(file) : "", line, text: text.trim().slice(0, 110) });

let usesAnimation = null, hasReducedMotion = false, sectionCount = 0;
const eyebrows = [];
const fonts = new Map();
const hexCounts = new Map();

const noteFont = (name, file) => {
  const n = name.replace(/["'+_]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  if (!n || GENERIC_FONTS.test(n)) return;
  if (!fonts.has(n)) fonts.set(n, file);
};

function scanImgAlt(src, file) {
  const re = /<img\b/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index, depth = 0, quote = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (quote) { if (c === quote) quote = null; continue; }
      if (c === '"' || c === "'" || c === "`") quote = c;
      else if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === ">" && depth <= 0) break;
    }
    const tag = src.slice(m.index, i + 1);
    if (!/\balt\s*=/.test(tag) && !/\{\s*\.\.\./.test(tag)) {
      const line = src.slice(0, m.index).split("\n").length;
      add("img-alt", file, line, tag.replace(/\s+/g, " "));
    }
  }
}

for (const f of files) {
  const src = readFileSync(f, "utf8");
  if (src.includes("slop-ignore-file")) continue;
  const ext = extname(f).toLowerCase();
  const isMarkup = MARKUP.has(ext), isStyle = STYLE.has(ext), isProse = ext === ".md" || ext === ".mdx" || ext === ".json";
  const isTokenFile = /(token|theme|global|variables|palette|colou?rs|tailwind\.config)/i.test(basename(f));

  if (CODE_OR_MARKUP.has(ext)) {
    if (/from\s+["'](gsap|framer-motion|motion\/react|motion|lenis|@studio-freight\/lenis|aos)["']|require\(["'](gsap|aos)["']\)|@keyframes|\banimate-(?!none\b)[a-z]|\banimation\s*:\s*(?!none\b)[a-z]/.test(src)) usesAnimation ??= f;
    if (/prefers-reduced-motion|useReducedMotion|reducedMotion|motion-reduce:|motion-safe:/.test(src)) hasReducedMotion = true;
  }
  if (isMarkup) {
    scanImgAlt(src, f);
    sectionCount += (src.match(/<section\b/g) || []).length;
  }

  // fonts
  for (const m of src.matchAll(/fonts\.googleapis\.com\/css2?\?[^"'\s)>]+/g))
    for (const fam of m[0].matchAll(/family=([^:&"']+)/g)) noteFont(decodeURIComponent(fam[1]), f);
  for (const m of src.matchAll(/api\.fontshare\.com\/v2\/css\?[^"'\s)>]+/g))
    for (const fam of m[0].matchAll(/f\[\]=([a-z0-9-]+)/g)) noteFont(fam[1].replace(/-/g, " "), f);
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']next\/font\/google["']/g))
    for (const n of m[1].split(",")) noteFont(n.split(/\s+as\s+/)[0], f);
  for (const m of src.matchAll(/["']@fontsource(?:-variable)?\/([a-z0-9-]+)/g)) noteFont(m[1].replace(/-/g, " "), f);
  for (const m of src.matchAll(/(?:font-family|--font-[\w-]+)\s*:\s*["']?([^"',;}\n]+)/g)) noteFont(m[1], f);
  for (const m of src.matchAll(/\b(sans|serif|display|body|heading|mono)\s*:\s*\[\s*["']([^"']+)/g)) noteFont(m[2], f);

  let inTokenBlock = 0;
  src.split("\n").forEach((line, idx) => {
    const n = idx + 1;
    if (line.includes("slop-ignore")) return;

    if (line.includes(EM) || /&mdash;|&#8212;|&#x2014;|\\u2014/i.test(line)) add("em-dash", f, n, line);
    if (line.includes(EN) || /&ndash;|&#8211;|&#x2013;|\\u2013/i.test(line)) add("en-dash", f, n, line);
    if (PLACEHOLDERS.some((re) => re.test(line))) add("placeholder", f, n, line);

    if (!isStyle) {
      if (WORD_RE.test(line)) add("slop-words", f, n, line);
      if (PHRASES.some((re) => re.test(line))) add("slop-phrases", f, n, line);
    }
    if (isProse && ext !== ".mdx") return;

    if (/(?:color|background|fill|stroke|border[\w-]*)\s*:\s*(#000(000)?\b|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|black\b)|\b(bg|text)-black\b(?!\/)/i.test(line)) add("pure-black", f, n, line);
    if (/\b(from|via)-(purple|violet|indigo|fuchsia)-\d{2,3}\b/.test(line) || purpleGradient(line)) add("ai-gradient", f, n, line);
    if (/bg-clip-text[^"'`]*text-transparent|text-transparent[^"'`]*bg-clip-text|background-clip\s*:\s*text/.test(line)) add("gradient-text", f, n, line);
    if (/shadow-\[0_0_\d+px_(?!rgba\(0,0,0)[^\]]*\]|box-shadow\s*:\s*0\s+0\s+(1[6-9]|[2-9]\d|\d{3})px\s+(?!rgba\(0,\s*0,\s*0)/.test(line)) add("neon-glow", f, n, line);
    if (/transition\s*:\s*all\b|\btransition-all\b/.test(line)) add("transition-all", f, n, line);
    if (/cursor\s*:\s*none|\bcursor-none\b/.test(line)) add("custom-cursor", f, n, line);
    if (/\bSparkles(Icon)?\b|\u{2728}/u.test(line)) add("sparkle-icon", f, n, line);
    if (/<(h[1-3]|button)\b[^>]*>[^<]*[\p{Extended_Pictographic}]/u.test(line.replace(/[\u00A9\u00AE\u2122]/g, ""))) add("emoji-ui", f, n, line);
    if (/via\.placeholder\.com|placehold\.(co|it)|dummyimage\.com|placekitten\.com/.test(line)) add("placeholder-image", f, n, line);

    if (isMarkup && (/\buppercase\b/.test(line) && /\btracking-(wide|wider|widest|\[[\d.]+(em|px)\])/.test(line) || /class(Name)?=["'{`][^"'`]*\beyebrow\b/.test(line))) eyebrows.push({ file: relative(root, f), line: n });

    // hex sprawl, ignoring token definitions
    if (isStyle && /(:root|\[data-theme|\.dark\b|@theme)[^{]*\{/.test(line)) inTokenBlock = 1;
    else if (inTokenBlock) { inTokenBlock += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length; if (inTokenBlock < 0) inTokenBlock = 0; }
    if (!isTokenFile && !inTokenBlock && !/^\s*--[\w-]+\s*:/.test(line))
      for (const h of line.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b(?![0-9a-f])/gi)) hexCounts.set(h[0].toLowerCase(), (hexCounts.get(h[0].toLowerCase()) || 0) + 1);
  });
}

function purpleGradient(line) {
  const g = line.match(/(linear|radial|conic)-gradient\(([^;]+)/);
  if (!g) return false;
  const hexes = [...g[2].matchAll(/#([0-9a-f]{6})\b/gi)].map((m) => m[1]);
  if (hexes.length < 2) return false;
  return hexes.some((h) => {
    const [r, gg, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, gg, b), min = Math.min(r, gg, b), d = max - min;
    if (d < 0.25) return false;
    let hue = max === r ? ((gg - b) / d) % 6 : max === gg ? (b - r) / d + 2 : (r - gg) / d + 4;
    hue = (hue * 60 + 360) % 360;
    return hue >= 250 && hue <= 320;
  });
}

// project-level rules
if (usesAnimation && !hasReducedMotion) add("reduced-motion", usesAnimation, 0, "animation used here, no reduced-motion guard in any file");
const famList = [...fonts.keys()];
for (const fam of famList) if (OVERUSED_FONTS.includes(fam)) add("overused-font", fonts.get(fam), 0, fam);
if (famList.length === 1 && famList[0] === "inter") add("overused-font", fonts.get("inter"), 0, "Inter is the only font");
if (famList.length > 3) add("font-count", "", 0, `${famList.length} families: ${famList.join(", ")}`);
const maxEyebrows = Math.max(1, Math.ceil(sectionCount / 3));
if (sectionCount && eyebrows.length > maxEyebrows) add("eyebrow-overuse", "", 0, `${eyebrows.length} eyebrow labels for ${sectionCount} sections (max ${maxEyebrows}). First: ${eyebrows.slice(0, 3).map((e) => `${e.file}:${e.line}`).join(", ")}`);
if (hexCounts.size > 10) {
  const top = [...hexCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([h, c]) => `${h} x${c}`).join(", ");
  add("color-sprawl", "", 0, `${hexCounts.size} distinct hardcoded hex colors. Most repeated: ${top}`);
}

// ---------- report
let errors = 0, warns = 0;
for (const [rule, list] of Object.entries(findings)) {
  if (!list.length) continue;
  const { level, fix } = RULES[rule];
  level === "error" ? (errors += list.length) : (warns += list.length);
  console.log(`\n${level === "error" ? "ERROR" : "WARN "}  ${rule} (${list.length})  ${fix}`);
  for (const f of list.slice(0, 12)) console.log(`   ${f.file ? `${f.file}${f.line ? `:${f.line}` : ""}  ` : ""}${f.text}`);
  if (list.length > 12) console.log(`   ... and ${list.length - 12} more`);
}

const fail = errors > 0 || (STRICT && warns > 0);
console.log(`\n${files.length} files scanned. ${errors} error(s), ${warns} warning(s). ${fail ? "FAIL" : errors + warns ? "PASS with warnings" : "CLEAN"}`);
if (fonts.size) console.log(`Fonts: ${famList.join(", ")}`);
process.exit(fail ? 1 : 0);
