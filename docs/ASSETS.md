# Assets

## Policy: there are no image files

Every image slot in Roamance is **drawn in SVG from a small data object**, not
photographed. No `public/images/`, no licence tracking, no compression step, no
404s in the demo, and no 15 MB of binaries to merge around in a single
session.

This also matches the design handoff, which ships diagonal-stripe placeholders
with captions naming what belongs in each slot rather than real photography.

## The `art` object

Boards, swipe photos, and trips all carry the same shape:

```json
"art": { "sky": "#2A1B3D", "accent": "#E8B44A", "motif": "brass" }
```

| Field | Meaning |
|---|---|
| `sky` | Background base colour, hex. |
| `accent` | Foreground / highlight colour, hex. |
| `motif` | Which scene to draw. |

## The component

```jsx
import Art from "../components/Art.jsx";

<Art art={trip.art} caption={board.caption} className="art--wide" />
```

| Prop | Notes |
|---|---|
| `art` | The object above. |
| `caption` | Names the photograph this stands in for. Rendered as a monospace chip and used as the SVG's accessible label. |
| `className` | `art--tall` (3:4), `art--wide` (16:9), or nothing for the 4:3 default. |

Shape comes from CSS, not from the component — `<Art>` fills whatever box you
put it in.

## Current state: a stub

`src/components/Art.jsx` renders the stripe placeholder for **every** motif.
That is intentional. It means Phase B can build and lay out trip cards before
Phase A has drawn anything.

**Phase A owns replacing the internals.** Two rules:

1. **Do not change the props.** Three screens already call it.
2. **Keep the stripe fallback.** Any motif you have not drawn yet should fall
   through to it, so the app is never broken — only progressively less
   abstract. Draw them one at a time and merge as you go.

## Motifs

Ten, spanning trips, boards, and swipe photos:

| Motif | Depicts | Used by |
|---|---|---|
| `brass` | Horns and a bar sign at night | New Orleans, Brass and Neon board |
| `mural` | Painted wall, market awnings | Mexico City, Market Mornings board |
| `rowhouse` | Stacked facades and stairs | Montreal, gallery photo |
| `skyline` | Towers against a flat sky | Chicago, rooftop photo |
| `oak` | Branches and hanging moss | Savannah, Porch and Moss board |
| `waves` | Flat water in horizontal bands | Sun-Bleached Coastal board |
| `palm` | Fronds over a low horizon | Tulum, hammock photo |
| `dune` | Sand ridges and grass | Gulf Shores, empty-sand photo |
| `ferry` | A wake and a rail | San Juan, Isla Mujeres, Blue Water board |
| `ridge` | Stacked ranges in haze | Asheville, Ridge and Fog board |

Keep them **abstract and flat** — shapes, bands, silhouettes. They read at
120px on a card. A detailed illustration will not, and will cost an hour each.

## Drawing guidance

- Use the `viewBox="0 0 400 300"` coordinate space already in the stub, with
  `preserveAspectRatio="xMidYMid slice"`, so one drawing works in all three
  aspect ratios.
- Compose from `sky` and `accent` plus opacity. Do not hard-code a third
  colour, or a retheme will miss it.
- Give every `<pattern>` or `<linearGradient>` a **unique id that includes the
  motif and colours**. SVG defs are global to the document — two `<Art>` on one
  screen with the same id will both render the first one's fill. The stub shows
  the pattern to follow.
- Decorative inner shapes need no `aria` attributes; the wrapper `<svg>`
  already carries `role="img"` and the caption as its label.

## Fonts

Work Sans, loaded from Google Fonts in `index.html`, with a real system
fallback stack in `--font`. If the class wifi drops the webfont the app still
reads — check that the fallback is not obviously broken before demoing.

## If someone insists on real photography

They shouldn't, for this prototype. If it happens anyway: it changes the data
schema, `Art.jsx`, `ASSETS.md`, and the licence story all at once, so it is a
team decision made before anyone branches — not a thing to slip into a PR.
