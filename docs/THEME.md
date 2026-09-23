# Theming Roamance

For whoever owns the visual design. You should be able to retheme this entire
app without opening a `.jsx` file.

## The one file

`src/index.css`. The block at the top, between the big `THE DESIGN SURFACE`
banner and `* { box-sizing }`, is the whole theme. Everything below it is
component CSS that only ever reads `var(--token)` — no raw hex, no raw px
radius, no hard-coded font.

Change a token, every screen changes.

## See a change

```bash
npm run dev
```

Then edit `src/index.css` and save. The browser updates without a reload.

Before you push:

```bash
npm run build
```

## Token groups

| Group | Tokens | What it controls |
|---|---|---|
| Accents | `--coral`, `--teal`, `--gold` and their `-soft` / `-deep` variants | Coral is the "romance" half of the name and carries calls to action. Teal is the "roam" half. Gold is reserved for the estimate and honesty badges so money copy never wears the same colour as a button. |
| Ground and ink | `--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-2`, `--ink-3`, `--line` | Page ground, card surfaces, three levels of text contrast, hairlines. |
| Radius | `--radius-sm` (10), `--radius-md` (16), `--radius-lg` (26) | Chips and inputs take sm, cards md, hero and photo surfaces lg. `--radius` is an alias for md. |
| Spacing | `--space-1` (4) … `--space-8` (32) | Use these rather than typing px into a component. |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg` | Accent-tinted, not neutral grey, so cards sit on the warm ground instead of floating above a cooler one. `--shadow-card` and `--shadow-lift` are aliases. |
| Type | `--font`, `--font-heading`, `--font-heading-weight` | Work Sans, loaded in `index.html`. |

## Where the values came from

`design/roamance-handoff/` is the art-direction source of truth — `modernist.css`
plus the override block at the top of `Likeness.dc.html`'s `<style>`, with
screenshots in `design/roamance-handoff/screenshots/`.

The accent ramps, radii, spacing scale, and Work Sans here are the handoff's
values. Two deliberate divergences:

- **Ground is warmer.** The handoff ships `#f3f2f2`, a neutral grey. This uses
  `#f4f1ee`, which is slightly warm. If you want the handoff exactly, change
  `--bg` to `#f3f2f2` and `--surface-2` to `#e8e6e4`.
- **Dark mode exists here and does not in the handoff.** The `@media
  (prefers-color-scheme: dark)` block is a from-scratch dark palette. If you
  restyle the light theme, check it — it is the half most likely to rot.

## Colours are in oklch

`oklch(64% 0.19 35)` is lightness / chroma / hue. Nudging only the first number
lightens or darkens without shifting the hue, which is why the ramps stay
coherent. Any hex value still works if you prefer one — nothing depends on the
format.

`color-mix(in oklch, var(--coral) 14%, #d8d1c9)` tints a neutral with the
accent. It is how the hairlines and shadows pick up the coral without being
coral.

## Rules that are not yours to change

Two things in the UI are load-bearing for the product, not decoration:

1. **The estimate badge** must stay visible anywhere a price appears. Restyle
   it freely; do not remove it or make it invisible. Every price in this app is
   invented.
2. **Tradeoff text** on an enabled hack must stay legible — same reading weight
   as the saving it sits next to. The entire argument of this rebrand is that
   the cost of a saving is shown as plainly as the saving. Greying it out
   quietly undoes that.

## If a change needs a .jsx file

Then a token is missing. Add it to the design surface block, use it in the
component, and mention it in the PR — that keeps the next retheme to one file.
