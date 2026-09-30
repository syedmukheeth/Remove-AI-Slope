# Remove AI Slop

A Claude Code skill that builds premium websites that do not look AI-generated.

No em dashes. No purple gradients. No "elevate your business". Colors that pass contrast in light and dark mode, font pairings that fit the brand, and a scanner that catches the slop before your client does. <!-- slop-ignore -->

## What it fixes

| AI slop | What this skill does instead |
|---|---|
| Em dashes in every sentence | Zero. The scanner fails the build, `--fix-dashes` rewrites them |
| Purple to blue gradients, neon glows | 10 hand-tuned palettes, one accent, tinted neutrals |
| Inter everywhere, or 4 random fonts | 10 free font pairings matched to each palette |
| Grey text you can barely read | Every text pair verified against WCAG (7:1 body, 4.5:1 secondary) |
| Dark mode as an afterthought | Every palette ships a designed dark version |
| Three icon cards in a row, eyebrow on every section | Layout rules and section variety |
| Copy full of buzzwords | Banned word and phrase list plus rewrite rules |
| Fake testimonials, lorem ipsum, John Doe | Scanner flags every placeholder <!-- slop-ignore --> |
| Janky animation, no reduced motion | Shared motion constants, reduced motion required |

## Install

**Claude Code plugin (easiest)**

```
/plugin marketplace add syedmukheeth/Remove-AI-Slope
/plugin install remove-ai-slop@remove-ai-slop
```

**Manual (macOS / Linux)**

```bash
git clone https://github.com/syedmukheeth/Remove-AI-Slope.git
cp -r Remove-AI-Slope/skills/remove-ai-slop ~/.claude/skills/
```

**Manual (Windows PowerShell)**

```powershell
git clone https://github.com/syedmukheeth/Remove-AI-Slope.git
Copy-Item -Recurse Remove-AI-Slope\skills\remove-ai-slop $HOME\.claude\skills\
```

**Other agents** (Cursor, Codex, Gemini CLI, and anything that reads `SKILL.md`)

```bash
npx skills add syedmukheeth/Remove-AI-Slope
```

Restart Claude Code after installing. Needs Node 18+ for the scripts.

## Use it

Just ask for a website. The skill kicks in on its own:

```
Build a landing page for a dental clinic in Austin
Make this site look premium, it looks AI generated
Remove the AI slop from ./my-portfolio
Give me a color palette and fonts for a barbershop
```

Or call it directly: `/remove-ai-slop coffee roaster in Leeds`

## The scanner

Run it on any project, with or without Claude:

```bash
node ~/.claude/skills/remove-ai-slop/scripts/slop-check.mjs ./my-site
```

```
ERROR  em-dash (2)  Rewrite the sentence with a period, comma, colon, or parentheses.
   src/App.jsx:11  <p>We build websites [dash] fast.</p>
WARN   ai-gradient (1)  Purple/violet/indigo gradients are the default AI look.
   src/App.jsx:8   <section className="bg-gradient-to-r from-purple-600 to-pink-500">

2 files scanned. 7 error(s), 25 warning(s). FAIL
```

| Errors (fail the check) | Warnings |
|---|---|
| Em dashes and en dashes, including `&mdash;` | AI buzzwords and sentence patterns <!-- slop-ignore --> |
| Lorem ipsum, John Doe, Acme, (555) numbers | Pure black, purple gradients, neon glows <!-- slop-ignore --> |
| Images without alt text | Gradient headline text, `transition: all` |
| Animation with no reduced-motion handling | Sparkles icon, emoji in headings and buttons |
| | Overused fonts, more than 3 font families |
| | Eyebrow label on too many sections |
| | Hardcoded hex colors outside the token file |

Flags: `--fix-dashes` rewrites every dash in place (ranges become `2019-2026` or `9am to 5pm`, clause dashes become commas), `--strict` fails on warnings too. Add `slop-ignore` to a line to skip it.

## The palettes

Light and dark, background / text / accent. Every pair checked with `node scripts/palette.mjs --check`.

| id | Light | Dark | Built for | Fonts |
|---|---|---|---|---|
| `graphite-signal` | ![#FAFAFA](https://img.shields.io/badge/%20-FAFAFA?style=flat-square) ![#0E0F12](https://img.shields.io/badge/%20-0E0F12?style=flat-square) ![#2446F5](https://img.shields.io/badge/%20-2446F5?style=flat-square) | ![#0B0C0F](https://img.shields.io/badge/%20-0B0C0F?style=flat-square) ![#EDEEF2](https://img.shields.io/badge/%20-EDEEF2?style=flat-square) ![#7C94FF](https://img.shields.io/badge/%20-7C94FF?style=flat-square) | SaaS, AI products, developer tools | `geist` |
| `forest-bone` | ![#F3F3EE](https://img.shields.io/badge/%20-F3F3EE?style=flat-square) ![#12201A](https://img.shields.io/badge/%20-12201A?style=flat-square) ![#1E5134](https://img.shields.io/badge/%20-1E5134?style=flat-square) | ![#0D1410](https://img.shields.io/badge/%20-0D1410?style=flat-square) ![#E8ECE5](https://img.shields.io/badge/%20-E8ECE5?style=flat-square) ![#82C79D](https://img.shields.io/badge/%20-82C79D?style=flat-square) | wellness, outdoor gear, landscaping | `bricolage-instrument` |
| `terracotta-slate` | ![#F3F4F5](https://img.shields.io/badge/%20-F3F4F5?style=flat-square) ![#1A1E23](https://img.shields.io/badge/%20-1A1E23?style=flat-square) ![#A8431F](https://img.shields.io/badge/%20-A8431F?style=flat-square) | ![#111417](https://img.shields.io/badge/%20-111417?style=flat-square) ![#E8EAED](https://img.shields.io/badge/%20-E8EAED?style=flat-square) ![#E58563](https://img.shields.io/badge/%20-E58563?style=flat-square) | architecture, interior design, real estate | `jakarta-jetbrains` |
| `black-tan` | ![#F4F3F1](https://img.shields.io/badge/%20-F4F3F1?style=flat-square) ![#141312](https://img.shields.io/badge/%20-141312?style=flat-square) ![#7E5B3A](https://img.shields.io/badge/%20-7E5B3A?style=flat-square) | ![#0F0E0D](https://img.shields.io/badge/%20-0F0E0D?style=flat-square) ![#F2EEE8](https://img.shields.io/badge/%20-F2EEE8?style=flat-square) ![#CFA67C](https://img.shields.io/badge/%20-CFA67C?style=flat-square) | fashion, barbershops, leather goods | `cormorant-jost` |
| `cold-luxury` | ![#F4F5F7](https://img.shields.io/badge/%20-F4F5F7?style=flat-square) ![#0A0B0D](https://img.shields.io/badge/%20-0A0B0D?style=flat-square) ![#343E4C](https://img.shields.io/badge/%20-343E4C?style=flat-square) | ![#0A0B0D](https://img.shields.io/badge/%20-0A0B0D?style=flat-square) ![#F1F2F4](https://img.shields.io/badge/%20-F1F2F4?style=flat-square) ![#C9CFD8](https://img.shields.io/badge/%20-C9CFD8?style=flat-square) | watches, automotive, private banking | `unbounded-manrope` |
| `olive-brick` | ![#EFEFE6](https://img.shields.io/badge/%20-EFEFE6?style=flat-square) ![#1D2015](https://img.shields.io/badge/%20-1D2015?style=flat-square) ![#9C341E](https://img.shields.io/badge/%20-9C341E?style=flat-square) | ![#13140F](https://img.shields.io/badge/%20-13140F?style=flat-square) ![#ECECE3](https://img.shields.io/badge/%20-ECECE3?style=flat-square) ![#E4775A](https://img.shields.io/badge/%20-E4775A?style=flat-square) | restaurants, bakeries, coffee | `dmserif-dmsans` |
| `mono-pop` | ![#F6F6F4](https://img.shields.io/badge/%20-F6F6F4?style=flat-square) ![#0C0C0C](https://img.shields.io/badge/%20-0C0C0C?style=flat-square) ![#FF4A1C](https://img.shields.io/badge/%20-FF4A1C?style=flat-square) | ![#0C0C0C](https://img.shields.io/badge/%20-0C0C0C?style=flat-square) ![#F2F2F0](https://img.shields.io/badge/%20-F2F2F0?style=flat-square) ![#FF5A2E](https://img.shields.io/badge/%20-FF5A2E?style=flat-square) | creative agencies, portfolios, design studios | `clash-satoshi` |
| `navy-mint` | ![#F5F7F9](https://img.shields.io/badge/%20-F5F7F9?style=flat-square) ![#0B1B2B](https://img.shields.io/badge/%20-0B1B2B?style=flat-square) ![#0B7560](https://img.shields.io/badge/%20-0B7560?style=flat-square) | ![#08131F](https://img.shields.io/badge/%20-08131F?style=flat-square) ![#E6EDF3](https://img.shields.io/badge/%20-E6EDF3?style=flat-square) ![#5FD4B4](https://img.shields.io/badge/%20-5FD4B4?style=flat-square) | fintech, clinics, healthcare | `plex` |
| `midnight-lime` | ![#F5F6F1](https://img.shields.io/badge/%20-F5F6F1?style=flat-square) ![#10130D](https://img.shields.io/badge/%20-10130D?style=flat-square) ![#C6F432](https://img.shields.io/badge/%20-C6F432?style=flat-square) | ![#0B0D0A](https://img.shields.io/badge/%20-0B0D0A?style=flat-square) ![#F0F3EA](https://img.shields.io/badge/%20-F0F3EA?style=flat-square) ![#C6F432](https://img.shields.io/badge/%20-C6F432?style=flat-square) | fitness, sports, energy drinks | `barlow` |
| `plum-blush` | ![#F8F4F3](https://img.shields.io/badge/%20-F8F4F3?style=flat-square) ![#24121C](https://img.shields.io/badge/%20-24121C?style=flat-square) ![#7B2D57](https://img.shields.io/badge/%20-7B2D57?style=flat-square) | ![#150B11](https://img.shields.io/badge/%20-150B11?style=flat-square) ![#F5EBEF](https://img.shields.io/badge/%20-F5EBEF?style=flat-square) ![#F0A6C4](https://img.shields.io/badge/%20-F0A6C4?style=flat-square) | beauty, skincare, spas | `newsreader-intertight` |

Get ready-to-paste CSS variables (light, dark, focus ring, selection, tinted shadows):

```bash
node ~/.claude/skills/remove-ai-slop/scripts/palette.mjs navy-mint
node ~/.claude/skills/remove-ai-slop/scripts/palette.mjs navy-mint --tailwind
node ~/.claude/skills/remove-ai-slop/scripts/palette.mjs --suggest "yoga studio"
```

## What's inside

```
skills/remove-ai-slop/
  SKILL.md                  workflow, 21 rules, pre-flight checklist
  reference/
    palettes.json           10 palettes, light + dark tokens
    color.md                token system, dark mode, gradients, building custom palettes
    fonts.md                10 pairings with load snippets, type scale, fonts to avoid
    copy.md                 no dashes, banned words and patterns, how to write headlines
    layout-motion.md        spacing, hero, section variety, motion constants, reduced motion
  scripts/
    slop-check.mjs          the scanner
    palette.mjs             palette tokens and contrast checker
```

Zero dependencies. Works with any stack: Next.js, Vite, Astro, plain HTML, Vue, Svelte.

## License

MIT
