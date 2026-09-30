# Layout and Motion

## Spacing

One scale, used everywhere. 4px base: `4 8 12 16 24 32 48 64 96 128`. A value outside the scale (`13px`, `pt-[57px]`) is a guess.

```css
:root {
  --section-y: clamp(4rem, 3rem + 6vw, 8rem);   /* vertical padding per section */
  --gutter: clamp(1rem, 0.5rem + 2vw, 2rem);    /* page side padding, 16px minimum on phones */
  --container: 76rem;                            /* about 1216px */
  --radius: 14px;                                /* pick one system, see below */
}
.container { width: min(100% - 2 * var(--gutter), var(--container)); margin-inline: auto; }
section { padding-block: var(--section-y); }
```

- More space between groups than inside them. A heading sits closer to its paragraph than to the previous section.
- Section padding is generous and identical across sections. Uneven section spacing reads as unfinished.
- No horizontal scroll at 375px. Test it.

## Corners: one system

Pick one and write it down:

- **Sharp:** radius 0 to 4px everywhere. Editorial, luxury, architecture.
- **Soft:** 12 to 16px cards, 10px inputs, 10 to 12px buttons. SaaS, services.
- **Pill:** full radius on buttons and tags, 20 to 24px on cards. Consumer, friendly.

Nested corners: inner radius = outer radius minus padding. A 24px card with 8px padding holds a 16px image.

## Hero

- Fits in the first viewport on a laptop (1440x800) with the primary button visible.
- Max 4 text elements: optional eyebrow, headline (max 2 lines on desktop), one sentence of subtext, buttons (1 primary, at most 1 secondary).
- Logo walls, feature bullets, pricing teasers, and avatar rows go in the section below, not in the hero.
- Top padding under about 6rem on desktop. If it feels empty, make the type or image bigger, not the gap.
- Real imagery or a real product shot. No floating 3D blobs, no abstract gradient orbs as the subject.

## Section variety

The fastest way to look templated is repeating one layout. On a page with 7+ sections use at least 4 layout families. Families to rotate:

- Split (text + media), max 2 in a row
- Full-bleed image or video with overlaid headline
- Asymmetric bento with cells sized by importance (and exactly as many cells as content, no filler tile)
- Horizontal scroller or marquee
- Big number / stat band
- Stacked list with large type (services, FAQ)
- Single centered statement

Banned as default:

- **Three identical cards in a row** with icon, title, two lines of text. The most recognizable AI section. Use a bento, a list, or a split.
- Zigzag image/text alternating for 3+ sections.
- Every section centered.
- Cards inside cards.

## Navigation

- One line on desktop, 64 to 72px tall. If items do not fit at 1024px, cut items.
- 4 to 6 links plus one button. The button label matches the hero's primary button.
- Mobile: full-screen or sheet menu, 44px minimum tap targets, closes on link tap and on Escape.

## Interaction states

Every interactive element has all of: default, hover, `:focus-visible` (visible ring in `--ring`), active (`scale(0.98)` or 1px press), disabled. Forms also have loading, success, and inline error states. Labels sit above inputs, never placeholder-as-label.

## Motion constants

Pull every value from here. A hardcoded `duration: 0.6` in a component is how pages end up with nine timings.

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);      /* arrive and settle: reveals, hovers */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* move between states: tabs, drawers */
  --dur-fast: 160ms;   /* hovers, presses */
  --dur-base: 280ms;   /* menus, tabs, small reveals */
  --dur-slow: 600ms;   /* section reveals */
  --stagger: 70ms;     /* between siblings */
  --rise: 24px;        /* reveal travel distance, one value page-wide */
}
```

JS libraries (GSAP, Motion) get the same numbers from one `motion.ts` file.

## Motion rules

- **Animate `transform` and `opacity` only.** Width, height, top, margin, and box-shadow trigger layout or paint.
- **No `transition: all`.** List the properties.
- **Reveals once.** Content fades up `--rise` on first view and stays. No re-animating on every scroll direction.
- **No scroll hijacking.** Native scroll speed. Smooth-scroll libraries only if the brief is a showcase, and never on content-heavy pages.
- **One signature moment per page** (a pinned scroll story, a hero reveal, a product spin). Everything else is quiet.
- **No custom cursors, no cursor trails, no magnetic everything.** One magnetic primary button is the ceiling.
- **Every animation earns its place** by explaining something or carrying the story. Decoration that loops forever gets cut.

## Reduced motion is required

Reduced motion means no travel, not no feedback. Content still appears, by opacity instead of movement.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

GSAP: wrap timelines in `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` branch. Framer Motion / Motion: `useReducedMotion()`. Autoplay video gets a pause button.

## Images

- Always `width` and `height` (or `aspect-ratio`) so nothing jumps while loading.
- Hero image `fetchpriority="high"`, everything below the fold `loading="lazy"`.
- AVIF or WebP. Hero under 250KB.
- Every `<img>` has real `alt` text describing the image, or `alt=""` if purely decorative.
- No text or tags stamped on top of photos as decoration. Captions go below.

## Performance targets

LCP under 2.5s, CLS under 0.1, INP under 200ms on a mid-range phone. Two font families, 3 to 4 weights. One animation library.
