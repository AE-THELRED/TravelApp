## How to build with Roamance

Roamance is a trip-matching app with an argument: booking sites advertise a
saving and hide what it costs you, so every saving here is shown beside its
tradeoff. Designs should feel warm and editorial — never like a spreadsheet.

**Build with the components; fall back to the classes for layout.** Eight
components ship: `Button`, `Chip`, `Card` + `CardBody`, `Field`, `Segmented`,
`Art`, `EstimateBadge`. Use them — they carry the sanctioned variants and the
bookkeeping (a `Segmented` owns its `aria-pressed`; a `Button` defaults to
`type="button"` so it cannot accidentally submit a form).

Layout and text are still plain classes, listed below. Use those names rather
than inventing parallel ones.

### Setup

No provider, no theme context, no wrapper. Link `styles.css` and the classes
work. Light and dark both come from `prefers-color-scheme` automatically — do
not build a theme toggle.

### The components

| Component | Notes |
|---|---|
| `Button` | `variant="primary"` (solid coral, at most one per screen), `"ghost"`, or default. `block` for full width. Already defaults to `type="button"`. |
| `Chip` | `tone="match"` is the coral % score, one per card. `tone="risk"` is gold and names what a saving costs — never decorative. Default tone carries match reasons. |
| `Card` + `CardBody` | `Card` is unpadded so `Art` can run to its edges; put content in `CardBody`. |
| `Field` | Wraps a **native** `<input>` or `<select>` — those are styled globally, so there is no `TextInput` to reach for. |
| `Segmented` | 2–4 mutually exclusive options. Past four, use a `<select>` in a `Field`. |
| `Art` | Every image slot. Draws SVG from `{ sky, accent, motif }`; `caption` names the photo it stands in for. |
| `EstimateBadge` | Required beside every price. |

### Layout and text classes

| Purpose | Classes |
|---|---|
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
import { Art, Card, CardBody, Chip, EstimateBadge } from "roamance";

<Card>
  <Art
    art={{ sky: "#2A1B3D", accent: "#E8B44A", motif: "brass" }}
    caption="board / trumpet under a bar sign"
    className="art--wide"
  />
  <CardBody>
    <div className="row" style={{ justifyContent: "space-between" }}>
      <strong>New Orleans</strong>
      <Chip tone="match">97%</Chip>
    </div>
    <div className="row">
      <Chip>food-forward</Chip>
      <Chip>stays up late</Chip>
    </div>
    <p className="tabular">$1,870 <span className="muted">· $468 per person</span></p>
    <Chip tone="risk">carry-on only</Chip>
    <EstimateBadge />
  </CardBody>
</Card>
```
