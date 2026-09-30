---
name: remove-ai-slop
description: Build premium websites that do not look AI-generated, or strip the AI look out of an existing site. Zero em dashes, contrast-verified color palettes with dark mode, curated font pairings, layout and motion rules, and a scanner that catches slop before it ships. Use when the user asks to build a website, landing page, portfolio, or marketing site, wants a site to look premium, expensive, professional, or less generic, says "remove AI slop", "de-slop", "looks AI generated", "no em dashes", or asks for a color palette or font pairing for a website.
argument-hint: [business or brief, or a project folder to de-slop]
---

# Remove AI Slop

Generated websites all look the same: purple gradients, Inter everywhere, three icon cards in a row, an eyebrow label above every heading, em dashes in every sentence, and copy full of words no business owner says out loud. Visitors spot it in two seconds and stop trusting the business.

This skill builds sites that look like a senior designer made them for this specific business. It has four parts:

- **Rules** for copy, color, type, layout, and motion (this file plus `reference/`).
- **10 palettes** with light and dark tokens, every text pair verified against WCAG.
- **10 font pairings** matched to those palettes, all free.
- **Two scripts** that measure instead of guessing.

## Scripts

Paths are relative to this skill's folder. In Claude Code use `${CLAUDE_SKILL_DIR}/scripts/...`.

```bash
node scripts/palette.mjs                          # list palettes
node scripts/palette.mjs --suggest "dental clinic"  # rank palettes for a brief
node scripts/palette.mjs navy-mint                # CSS tokens, light + dark, with contrast report
node scripts/palette.mjs navy-mint --tailwind     # Tailwind v4 @theme block (--tailwind3 for v3)
node scripts/palette.mjs --contrast "#555963" "#FAFAFA"
node scripts/slop-check.mjs <project-dir>         # scan for AI tells, exit 1 on errors
node scripts/slop-check.mjs <project-dir> --fix-dashes   # rewrite em/en dashes, then rescan
```

Never report a contrast ratio or a "clean" result you did not get from a script.

## Workflow: new site

### 1. Design read

Before any code, write one line and show it to the user:

> Design read: **[business]** for **[audience]**, should feel **[2 to 3 words]**. Palette: `[id]`. Fonts: `[id]`. Corners: [sharp / soft / pill]. Signature moment: [one thing].

Pick from this map, or run `palette.mjs --suggest`:

| Business | Palette | Fonts |
|---|---|---|
| SaaS, AI, developer tools | `graphite-signal` | `geist` |
| Wellness, outdoor, landscaping | `forest-bone` | `bricolage-instrument` |
| Architecture, interiors, real estate | `terracotta-slate` | `jakarta-jetbrains` |
| Fashion, barbers, spirits, menswear | `black-tan` | `cormorant-jost` |
| Automotive, watches, private finance | `cold-luxury` | `unbounded-manrope` |
| Restaurants, cafes, bakeries | `olive-brick` | `dmserif-dmsans` |
| Agencies, portfolios, events | `mono-pop` | `clash-satoshi` |
| Clinics, fintech, insurance | `navy-mint` | `plex` |
| Fitness, sports, energy | `midnight-lime` | `barlow` |
| Beauty, spas, florists | `plum-blush` | `newsreader-intertight` |

If the business has brand colors, use them: follow "Building a custom palette" in `reference/color.md` and verify each pair with `--contrast`. If the brief is too vague to pick a direction, ask one question, then proceed.

### 2. Tokens before components

1. `palette.mjs <id>` output goes into the global stylesheet. Add `--tailwind` output if the project uses Tailwind.
2. Font snippet from `reference/fonts.md`, plus the fluid type scale from the same file.
3. Spacing, radius, and motion constants from `reference/layout-motion.md`.

No component gets written until these exist. Components use tokens only. A hex code in a component is a bug.

### 3. Build

Use the project's stack. For a new site with no preference: Next.js or Vite + React, Tailwind v4, one motion library (GSAP or Motion). Follow the rules below while building, not as a cleanup pass afterwards.

### 4. Scan, fix, rescan

```bash
node scripts/slop-check.mjs .
```

Fix every ERROR. Fix every WARN or tell the user why it stays (a purple gradient is fine for a brand that is actually purple). Rescan until 0 errors. Paste the final summary line in your reply.

### 5. Look at it

Run the site and check 375px, 768px, and 1440px wide, light and dark. Go through the pre-flight list at the end of this file. The scanner reads code; only looking catches a hero that overflows or an image with the wrong mood.

## Workflow: de-slop an existing site

1. Run `slop-check.mjs` first and show the user the report before changing anything.
2. Fix in this order, biggest visible win first: dashes and copy, then color tokens, then type, then layout, then motion.
3. Keep their content, brand colors, and logo. Tokenize the brand color, do not replace it. Ask before changing anything the brand owns.
4. Rescan and report before and after counts.

## The rules

### Copy (details: `reference/copy.md`)

1. **Zero em dashes and zero en dashes.** Anywhere visible, including alt text, meta tags, and quotes. Rewrite the sentence with a period, comma, colon, or parentheses. Ranges use a plain hyphen (2019-2026) or words (Mon to Fri).
2. No generic AI vocabulary or sentence patterns. The full list is in `reference/copy.md`. Say the concrete thing.
3. Headlines state the customer's outcome in 4 to 9 words. Subtext is one sentence under 20 words.
4. Buttons are 1 to 3 words, verb first. One label per intent across the whole page.
5. Never invent testimonials, stats, logos, awards, or certifications. Use a marked placeholder like `[Client quote: name, suburb]` and list them for the user.

### Color (details: `reference/color.md`)

6. Seven tokens: `bg`, `surface`, `ink`, `muted`, `border`, `accent`, `on-accent`. Everything reads from them.
7. One accent, under 10% of the page. Neutrals tinted toward the accent hue, one temperature per site.
8. No pure black, no purple-to-blue gradients, no neon glows, no gradient headline text unless the brand genuinely calls for it.
9. Dark mode is a designed second palette, not an inversion. Every token has a dark value.
10. Respect the accent label from `palette.mjs`: a "fill only" accent never becomes text.

### Type (details: `reference/fonts.md`)

11. Two families (display + body), optional mono for labels. 3 to 4 weights loaded.
12. Emphasis inside a headline uses italic or weight of the same family, never a random second font.
13. Tight tracking on big type (-0.03em), normal on body, body at 16px or larger, paragraphs 55 to 72 characters wide.
14. `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs, `tabular-nums` on numbers.

### Layout (details: `reference/layout-motion.md`)

15. The hero fits the first screen: headline (max 2 lines), one sentence, buttons. Nothing else.
16. No row of three identical icon cards. Rotate at least 4 layout families on a 7-section page.
17. Eyebrow labels on at most 1 in 3 sections. No section numbers as decoration.
18. One spacing scale, one corner-radius system, generous and equal section padding.
19. Real images with consistent color grading. No placeholder services, no fake UI built from divs.

### Motion (details: `reference/layout-motion.md`)

20. `transform` and `opacity` only, values from shared constants, one signature moment per page.
21. `prefers-reduced-motion` handled in the same commit as the animation. Content still appears, it just does not travel.

## Premium details most sites skip

- Focus ring in the accent color (`:focus-visible`), `::selection` in the accent.
- Buttons press down (`scale(0.98)`) on `:active`. Hover transitions 150 to 250ms.
- Link underlines with `text-underline-offset: 0.2em` and 1px thickness.
- Nested radii: inner radius = outer radius minus padding.
- Shadows tinted with the ink color, two layers, soft.
- Images with fixed `aspect-ratio` so nothing shifts on load.
- Favicon, Open Graph image, page titles, and meta descriptions written like copy, not left as defaults.
- Real 404 page and a form success state that says what happens next.

## Pre-flight

Do not call a site done until every line is true:

- [ ] `slop-check.mjs` shows 0 errors, and every remaining warning has a reason.
- [ ] `palette.mjs` report passes for the tokens in use (or `--contrast` on custom pairs).
- [ ] Hero fits a 1440x800 screen with the primary button visible.
- [ ] Nav on one line at 1024px. No horizontal scroll at 375px.
- [ ] Light and dark mode both look designed.
- [ ] Each section uses a different layout from its neighbors.
- [ ] One button label per intent. One accent color.
- [ ] Every placeholder is marked and listed for the user.
- [ ] Reduced motion tested by turning the OS setting on.

`$ARGUMENTS` is the business or brief for a new site, or the folder to de-slop. With a folder, start with the scan.
