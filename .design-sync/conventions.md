## How to build with Roamance

Roamance is a trip-matching app with an argument: booking sites advertise a
saving and hide what it costs you, so every saving here is shown beside its
tradeoff. Designs should feel warm and editorial — never like a spreadsheet.

**This design system is mostly CSS classes, not components.** Only two pieces
ship as React (`Art`, `EstimateBadge`). Everything else — buttons, chips, cards,
forms — is global CSS applied through `className`. Use the class vocabulary
below rather than inventing one.

### Setup

No provider, no theme context, no wrapper. Link `styles.css` and the classes
work. Light and dark both come from `prefers-color-scheme` automatically — do
not build a theme toggle.

### The class vocabulary

| Purpose | Classes |
|---|---|
| Actions | `.btn`, plus `.btn--primary` (solid coral, one per screen), `.btn--ghost`, `.btn--block` |
| Switches | `.segmented` wrapping `<button aria-pressed="true\|false">` |
| Labels | `.chip`; `.chip--match` (coral, the % score); `.chip--risk` (gold, what a saving costs) |
| Honesty | `.estimate-badge` — required beside every price |
| Surface | `.card` |
| Forms | `<label class="field">` wrapping a native `<input>` or `<select>` |
| Layout | `.screen`, `.screen--wide`, `.stack`, `.stack--sm`, `.stack--lg`, `.row`, `.grid-2`, `.topbar`, `.topbar__actions` |
| Text | `.muted`, `.dim`, `.eyebrow`, `.tabular` (use on every price — stops digits jittering as a cost updates) |
| Brand | `.wordmark` |

For your own layout glue, use the tokens — never a raw hex or px:
`var(--space-1)`…`var(--space-8)` (4px scale), `var(--radius-sm|md|lg)`,
`var(--shadow-sm|md|lg)`, and the colours below.

### Colour has fixed jobs

`--coral` acts (every call to action, the match score). `--teal` focuses (the
2px focus ring — never remove it). `--gold` is **money and honesty only** — the
estimate badge and risk chips. Never use gold for anything else: if price copy
wore the same colour as a button, the design would be doing the thing this
product criticises.

Ground and ink: `--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-2`,
`--ink-3`, `--line`. Text on a coral fill uses `--on-accent`.

### Two hard rules

1. **Every price carries `.estimate-badge`.** All prices are invented; the badge
   is what says so.
2. **A saving is never shown without its tradeoff**, at the same reading weight.
   Greying out the tradeoff quietly undoes the entire product.

### Where the truth lives

Read `styles.css` (and the `_ds_bundle.css` it imports) for the real tokens and
classes, `guidelines/docs/THEME.md` for what each token group controls, and
`guidelines/docs/ASSETS.md` for the generated-art system. There are **no image
files** — every image slot is `Art`, which draws SVG from `{ sky, accent, motif }`
and takes a `caption` naming the photo it stands in for.

### An idiomatic snippet

```jsx
import { Art, EstimateBadge } from "roamance";

<article className="card">
  <Art
    art={{ sky: "#2A1B3D", accent: "#E8B44A", motif: "brass" }}
    caption="board / trumpet under a bar sign"
    className="art--wide"
  />
  <div className="stack" style={{ padding: "var(--space-4)" }}>
    <div className="row">
      <strong>New Orleans</strong>
      <span className="chip chip--match">97%</span>
    </div>
    <div className="row">
      <span className="chip">food-forward</span>
      <span className="chip">stays up late</span>
    </div>
    <p className="tabular">$1,870 <span className="muted">· $468 per person</span></p>
    <span className="chip chip--risk">carry-on only</span>
    <EstimateBadge />
  </div>
</article>
```
