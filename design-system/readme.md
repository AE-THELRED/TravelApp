# Roamance design system

Warm paper ground, three accent voices with fixed jobs, soft radii, and shadows
tinted with the accent rather than neutral grey. The look is friendly and
editorial, not clinical — it is a matchmaking app about money, and it should
feel like neither a spreadsheet nor a dating app parody.

## How to use this

- Link the one stylesheet from every page — `<link rel="stylesheet" href="styles.css">`
  (adjust the relative path) — and take every colour, font, spacing step, radius
  and shadow from its variables (`var(--coral)`, `var(--space-4)`,
  `var(--radius-md)`, `var(--shadow-md)`). Never hard-code a hex, a font name, or
  a px value the tokens already carry.
- Build with the classes below rather than inventing parallel ones. The preview
  pages are plain HTML — view source and copy the markup.
- `styles.css` here is **generated** from `../src/index.css`, which is the real
  source of truth. Edit the token block at the top of **that** file, never this
  copy — it is overwritten on every build. Generating rather than importing
  keeps the bundle self-contained, so it still works when only
  `design-system/` is uploaded.
- After changing a token or adding a preview, run `node design-system/build.mjs`
  and commit the regenerated `theme.json`, `_ds_manifest.json`, and
  `_adherence.oxlintrc.json`.

## Direction

Cards on a warm ground, generous corner radius, real whitespace. Content sits in
a single centred column at 560px, widening to 900px only for the deck and the
saved comparison. Nothing is decorated for its own sake: the visual interest
comes from the generated art and from colour doing a job, not from borders and
gradients.

## Colour

A warm paper ground (`--bg` #f4f1ee) with `--ink` #201e1d, and three accents
that never swap jobs:

| Voice | Token | Job |
|---|---|---|
| Coral | `--coral` | Every call to action, and the match-score chip. The romance half of the name. |
| Teal | `--teal` | The focus ring, and anything about movement. The roam half. |
| Gold | `--gold` | Money and honesty only — the estimate badge and risk chips. |

Gold is deliberately fenced off. If price copy wore the same colour as a
button, the app would be doing exactly what it criticises: dressing a number up
as an invitation.

Each accent carries `-soft` (tinted fills), and coral additionally carries
`-deep` (accent text on a light ground) and `-hover` (one step past the base,
for hover and pressed). Text on an accent fill uses `--on-accent`, which flips
to ink in dark mode where the accents lighten.

Dark mode is a full second palette under `@media (prefers-color-scheme: dark)`.
It is the half most likely to rot — check it when you restyle.

## Type

Work Sans throughout, loaded in `index.html` with a real system fallback.
Headings take `--font-heading-weight` (700) and tighten to −0.02em; body is
15px/1.55. Anything rendering a price uses `.tabular` so digits stop jittering
as a cost updates under a toggle.

## Interaction states

Focus is a 2px `--teal` ring at 2px offset on every interactive element — never
the browser default, and never removed. Hover and pressed come from
`--coral-hover`. Disabled drops opacity and removes the pointer.

## Components

| Class | What it is | Shown in |
| --- | --- | --- |
| `.btn` with `.btn--primary`, `.btn--ghost`, `.btn--block` | Actions; primary is a solid coral fill | components/buttons.html |
| `.segmented` + `button[aria-pressed]` | Budget tier and sort switches | components/buttons.html |
| `.chip`, `.chip--match`, `.chip--risk` | Reason chips, the match score, and a hack's risk label | components/chips.html |
| `.estimate-badge` | The "estimated prototype data" label | components/chips.html |
| `.card` | The surface for matches, boards and saved trips | components/cards.html |
| `label.field`, `input`, `select` | Native form controls, themed | components/forms.html |
| `.art`, `.art--tall`, `.art--wide`, `.art__caption` | The generated-SVG image slot | components/art.html |
| `.stack`, `.row`, `.grid-2`, `.screen`, `.topbar` | Layout utilities | foundations/layout.html |
| `.muted`, `.dim`, `.eyebrow`, `.tabular` | Text roles | foundations/type.html |

## Do

- Let the art carry the colour. Cards are mostly ink on paper with one accent.
- Keep one primary action per screen.
- Show a price and its estimate badge together, always.
- Give a tradeoff the same reading weight as the saving it sits beside.

## Don't

- Do not use gold for anything that is not about money.
- Do not remove or restyle away the focus ring.
- Do not grey out tradeoff text. The whole argument of this product is that the
  cost of a saving is shown as plainly as the saving.
- Do not add an image file. Every image slot is drawn — see components/art.html.

## Files

- `styles.css` — the only stylesheet. Generated from `../src/index.css`.
- `readme.md` — this guide.
- `theme.json` — machine-readable record of the tokens. Generated.
- `thumbnail.html` — the cover: wordmark, swatches, a few components.
- `build.mjs` — regenerates `theme.json`, `_ds_manifest.json` and
  `_adherence.oxlintrc.json` from `src/index.css` and the `@dsCard` markers.
- `_ds_manifest.json` — the card index for the Design System pane. Generated.
- `_adherence.oxlintrc.json` — lint rules rejecting raw hex, raw px, and any
  font that is not Work Sans. Generated, so its token list cannot fall behind.
- `foundations/color.html` — the three voices and the neutral ramp.
- `foundations/type.html` — the scale, at real sizes.
- `foundations/layout.html` — spacing, radius and the three elevations.
- `components/*.html` — one preview per component group.

## Adding a preview

Create the HTML in `foundations/` or `components/`, link `../styles.css`, and
put the card marker on **line 1**:

```html
<!-- @dsCard group="Components" name="Hack Stack" subtitle="Toggles that move a cost and name what it costs you" viewport="640x520" -->
```

Then `node design-system/build.mjs`. The manifest picks it up; there is no
second file to edit.
