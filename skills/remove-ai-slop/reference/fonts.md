<!-- slop-ignore-file: font catalog lists every family on purpose -->
# Font Pairings

Ten pairings that are free, load fast, and do not look like every other AI site. Each id matches the `fonts` field in `palettes.json`, so a palette and its pairing are designed to go together. Mix across if the brief calls for it.

Rules that apply to every pairing:

- **Two families max.** A display face and a body face. A mono is allowed as a third only for labels, code, or data.
- **Emphasis stays in the family.** Want to stress a word in a headline? Use the italic or a heavier weight of the same font. Never drop a random serif word into a sans headline.
- **Load only the weights you use.** Usually 3 to 4 total. Every extra weight is a network request.
- **Always `display=swap`** and `preconnect` to the font host.

## The pairings

| id | Display | Body | Personality | Best for |
|---|---|---|---|---|
| `geist` | Geist 600 | Geist 400 + Geist Mono | Engineered, quiet, modern | SaaS, AI, dev tools |
| `bricolage-instrument` | Bricolage Grotesque 700 | Instrument Sans 400 | Warm, a little quirky, human | Wellness, local business, food, community |
| `jakarta-jetbrains` | Plus Jakarta Sans 700 | Plus Jakarta Sans 400 + JetBrains Mono | Friendly premium, clear | Agencies, services, architecture, startups |
| `cormorant-jost` | Cormorant Garamond 500 | Jost 400 | Tailored, fashion, old money | Fashion, jewelry, barbers, spirits |
| `unbounded-manrope` | Unbounded 600 | Manrope 400 | Wide, engineered, cold | Automotive, watches, hardware, private banking |
| `dmserif-dmsans` | DM Serif Display 400 | DM Sans 400 | Appetizing, classic, warm | Restaurants, cafes, bakeries, hotels |
| `clash-satoshi` | Clash Display 600 | Satoshi 400 | Loud, editorial, confident | Creative agencies, portfolios, events, music |
| `plex` | IBM Plex Sans 600 | IBM Plex Sans 400 + IBM Plex Mono | Rational, trustworthy, precise | Fintech, healthcare, legal, enterprise |
| `barlow` | Barlow Condensed 700 (uppercase) | Barlow 400 | Athletic, fast, punchy | Fitness, sports, energy, events |
| `newsreader-intertight` | Newsreader 500 | Inter Tight 400 | Literary, soft, polished | Beauty, spas, publishing, consulting |

## Load snippets

Paste into `<head>`. For Next.js use `next/font/google` with the same family names, or `next/font/local` for Fontshare files.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**geist**
```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```
```css
--font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
--font-body: "Geist", ui-sans-serif, system-ui, sans-serif;
--font-mono: "Geist Mono", ui-monospace, monospace;
```

**bricolage-instrument**
```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```
```css
--font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
--font-body: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
```

**jakarta-jetbrains**
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
```css
--font-display: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
--font-body: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

**cormorant-jost**
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;500&display=swap" rel="stylesheet">
```
```css
--font-display: "Cormorant Garamond", ui-serif, Georgia, serif;
--font-body: "Jost", ui-sans-serif, system-ui, sans-serif;
```
Cormorant runs small. Set display sizes about 15% larger than a sans would need, and never use it below 20px.

**unbounded-manrope**
```html
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
```
```css
--font-display: "Unbounded", ui-sans-serif, system-ui, sans-serif;
--font-body: "Manrope", ui-sans-serif, system-ui, sans-serif;
```
Unbounded is very wide. Headlines of 2 to 5 words only, and pull the size down one step.

**dmserif-dmsans**
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400..700&display=swap" rel="stylesheet">
```
```css
--font-display: "DM Serif Display", ui-serif, Georgia, serif;
--font-body: "DM Sans", ui-sans-serif, system-ui, sans-serif;
```

**clash-satoshi** (Fontshare, free for commercial use)
```html
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
```
```css
--font-display: "Clash Display", ui-sans-serif, system-ui, sans-serif;
--font-body: "Satoshi", ui-sans-serif, system-ui, sans-serif;
```

**plex**
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```
```css
--font-display: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
--font-body: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "IBM Plex Mono", ui-monospace, monospace;
```

**barlow**
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
```
```css
--font-display: "Barlow Condensed", ui-sans-serif, system-ui, sans-serif;
--font-body: "Barlow", ui-sans-serif, system-ui, sans-serif;
```
Display is uppercase with `letter-spacing: 0.01em`. Condensed faces get tight line height (0.95).

**newsreader-intertight**
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">
```
```css
--font-display: "Newsreader", ui-serif, Georgia, serif;
--font-body: "Inter Tight", ui-sans-serif, system-ui, sans-serif;
```

## Overused. Avoid unless the brand already uses them

These are what every template and every AI build reaches for. Using one is not wrong, using one by default is how a site starts to look generated.

- **Inter as the only font.** Fine as body under a characterful display face. Generic alone.
- **Poppins, Montserrat, Roboto, Open Sans, Lato, Nunito.** Template energy.
- **Space Grotesk.** The default "techy" pick for years now.
- **Fraunces, Instrument Serif, Playfair Display.** The default "make it editorial" serifs.

A serif is a choice with a reason (heritage, fashion, food, publishing), never a shortcut to "premium".

## Type scale (fluid, no breakpoints needed)

```css
:root {
  --step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.90rem);  /* captions, labels */
  --step-0:  clamp(1.00rem, 0.96rem + 0.20vw, 1.13rem);  /* body */
  --step-1:  clamp(1.25rem, 1.15rem + 0.50vw, 1.50rem);  /* h4, lead text */
  --step-2:  clamp(1.56rem, 1.38rem + 0.90vw, 2.10rem);  /* h3 */
  --step-3:  clamp(1.95rem, 1.60rem + 1.75vw, 3.00rem);  /* h2 */
  --step-4:  clamp(2.44rem, 1.90rem + 2.70vw, 4.20rem);  /* h1 */
  --step-5:  clamp(3.05rem, 2.20rem + 4.25vw, 5.75rem);  /* hero, 3 to 5 word headlines only */
}
```

## Setting the type

| Element | Line height | Letter spacing | Weight |
|---|---|---|---|
| Hero / h1 | 1.0 to 1.08 | -0.03em to -0.04em | 600 to 700 (serif: 400 to 500) |
| h2, h3 | 1.1 to 1.2 | -0.02em | 600 |
| Body | 1.55 to 1.7 | 0 | 400 |
| Small caps labels | 1.3 | +0.06em to +0.1em | 500 |
| Buttons | 1 | 0 to -0.01em | 500 to 600 |

```css
body { font-family: var(--font-body); font-size: var(--step-0); line-height: 1.6; -webkit-font-smoothing: antialiased; }
h1, h2, h3 { font-family: var(--font-display); text-wrap: balance; }
p { max-width: 65ch; text-wrap: pretty; }
.stat, table, .price { font-variant-numeric: tabular-nums; }
```

Checks before shipping:

- Body text never below 16px, never weight 300 on a light background.
- Paragraph width 55 to 72 characters.
- Italic display words with descenders (g, j, p, q, y) need line height of at least 1.1 or they clip.
- Big numbers and prices use `tabular-nums` so they do not jitter when they count up.
