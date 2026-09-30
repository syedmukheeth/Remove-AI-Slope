# Color

Premium color is mostly restraint. One accent, tinted neutrals, and contrast you measured instead of guessed.

## The system: 7 tokens, nothing else

| Token | Job | Rule |
|---|---|---|
| `--bg` | Page background | Never pure white `#FFF` on large areas, never pure black `#000`. Tint it toward the brand hue. |
| `--surface` | Cards, nav, inputs | One step off `--bg`. Elevation comes from this shift, not from heavy shadows. |
| `--ink` | Headlines and body text | 7:1 or better on both `--bg` and `--surface`. |
| `--muted` | Secondary text, captions, meta | 4.5:1 or better. Never lighter "for elegance". |
| `--border` | Hairlines, dividers, input strokes | Barely there. 1px. |
| `--accent` | The one brand color | Primary buttons, links, focus ring, one highlight per section. |
| `--on-accent` | Text on accent fills | 4.5:1 or better on `--accent`. |

Derived with `color-mix()` so they follow the theme automatically: `--accent-soft` (badges, selected states), `--ring` (focus), `--shadow-sm`, `--shadow-lg`. `scripts/palette.mjs` prints all of it.

Every component reads from these tokens. A hex code inside a component is a bug: it will not follow dark mode and it will drift from the brand.

## Proportions

- **About 60%** `--bg`, **30%** `--surface` and `--ink`, **under 10%** `--accent`.
- If you squint at a full-page screenshot and the accent is everywhere, it stops meaning "click here".
- One accent per page. A warm site does not get a teal badge in the footer. A second color is allowed only for real semantic state (error red, success green) and only where that state exists.

## Neutrals carry the brand

Grey is never just grey. Push the neutrals a few degrees toward the accent hue:

- Green brand: greens in the greys (`#12201A` ink, `#505C55` muted).
- Blue brand: cool greys (`#0E0F12`, `#555963`).
- Warm brand: warm greys (`#141312`, `#5B5650`).

Mixing warm greys and cool greys on one page is the fastest way to look cheap. Pick one temperature.

## Dark mode

Dark mode is a second palette, not an inversion.

- Background around `#0A0B0D` to `#151515`, tinted like the light neutrals. Never `#000`.
- Surfaces get **lighter** as they rise (bg, then surface, then raised surface). Shadows barely read on dark, so elevation is done with lightness.
- Accents get lighter and slightly less saturated, otherwise they vibrate. `--on-accent` usually flips to the dark background color.
- Body text around `#E8EAED`, not pure white. Pure white on near-black causes halation for a lot of readers.
- Every brand token needs a dark value. A dark theme that only flips the greys and leaves the accent at its light value is broken.

## Accents that fail as text

Some great brand colors (lime, yellow, vermilion, silver) cannot be text on a light background. `palette.mjs` labels each accent as:

- **text-safe**: 4.5:1 or better on bg. Links, small text, icons.
- **large text / UI only**: 3:1 to 4.5:1. Big headlines, icons, strokes.
- **fill only**: under 3:1. Buttons, badges, and color blocks with `--on-accent` text. Never text.

That is a placement rule, not a reason to change the brand color.

## Shadows

- Tint shadows with `--ink`, never pure black. `color-mix(in oklab, var(--ink) 14%, transparent)`.
- Two layers: a tight 1 to 2px contact shadow plus a soft wide one with negative spread.
- If a card needs a shadow AND a border AND a background change to look raised, pick one.

## Gradients

- Allowed: subtle, same-hue, low-contrast (accent to a slightly darker accent, bg to surface). Radial glows behind a product image at under 15% opacity.
- Not allowed by default: purple to blue, purple to pink, rainbow mesh blobs, neon glows, gradient text on big headlines. That combination is the signature of generated sites.
- A purple brand is fine when the brand is actually purple. Execute it with tinted neutrals and one accent like any other palette.

## Images are part of the palette

- Grade all photos the same way: same warmth, same contrast, same saturation. One cold stock photo in a warm site breaks it.
- Overlay text on photos only with a scrim (`linear-gradient` from `--ink` at 60% to transparent) and check the contrast on the darkest and lightest part of the image.
- Duotone or a single tint over mismatched photos is a legitimate fix.

## Building a custom palette

When no palette in `palettes.json` fits, build one and add it there so `node scripts/palette.mjs --check` verifies it:

1. Start from the brand color. That is `--accent`. If it is loud (lime, yellow, neon), plan for it to be fill only.
2. Pick the temperature of the neutrals from the accent hue.
3. `--ink` at very low lightness in that hue, `--bg` at very high lightness in that hue with saturation under 10%.
4. `--muted` halfway between, then darken until it passes 4.5:1 on both bg and surface.
5. Run the check. Adjust lightness, never hue, to fix failures.

Quick contrast for any pair: `node scripts/palette.mjs --contrast "#555963" "#FAFAFA"`.
