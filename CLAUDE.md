# CLAUDE.md — Roamance

Context file for Claude Code. Read this first, then the linked docs, before
writing code.

## Project

Roamance is a **front-end-only** prototype built in a single class session by a
team of two with limited coding experience. It is a rebrand of mainstream trip
booking — Expedia, Kayak, Booking — around one argument:

> Booking sites compete on the lowest headline number and hide what it costs
> you. Roamance shows the saving and the tradeoff in the same breath.

The user picks aesthetic **vibe boards**, refines on eight photos, and meets ten
destination "profiles" ranked against the taste that produces. Each match opens
a **true-cost card** with a **Hack Stack**: toggleable money-saving strategies
that move the estimate and always name what they cost you — a stairs walk-up, a
40-minute shuttle wait, someone on the pull-out couch.

Tagline: "Stop searching for trips. Meet one."

## Stack

| Concern | Choice |
|---|---|
| Build | Vite |
| UI | React 19, **plain JavaScript** — no TypeScript |
| Types | JSDoc typedefs in `src/lib/types.js` |
| Routing | None. One `screen` string in the reducer. |
| State | One `useReducer` in `App.jsx`, passed down as props. **No Context.** |
| Persistence | `localStorage`, one versioned key |
| Data | Committed static JSON in `src/data/` |
| Art | Generated SVG from an `art` object. No photography. |
| Lint | oxlint |
| Backend | None |

## Hard constraints (do not violate)

1. **No backend.** No server routes, no database, no auth.
2. **No API keys, no `.env` secrets, no credentialed SDKs.**
3. **No live prices and no fetching at runtime.** All data is committed JSON.
4. **No runtime LLM calls.** Bios are pre-authored; match scores come from a
   deterministic function.
5. Every price renders with a visible **"estimated prototype data"** label.
6. Persistence is **`localStorage` only**.
7. **No booking flow.** The design handoff has one; it is deliberately not
   adopted. See "Relationship to the design handoff" below.

## Definition of done for the prototype

A user can: land → enter constraints → pick vibe boards → swipe eight photos →
see a deck of ten ranked destinations → open one → toggle hacks and watch both
the cost and the tradeoff list change → save it → compare saved trips → reload
the page and still have all of it.

## Where things are

```
src/
  data/       trips.json (10), boards.json (6), swipes.json (8)
  lib/        scoring.js, cost.js, bio.js, storage.js, types.js
  state/      tripReducer.js
  screens/    Landing.jsx  (+ six more to build)
  components/ EstimateBadge.jsx (+ more to build)
  index.css   the entire design surface
design/roamance-handoff/   art direction: prototype HTML, CSS, screenshots
design-system/             the importable design system (generated from src/index.css)
```

## Documentation map

| Doc | Read when |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Always. Layers, data flow, module boundaries. |
| [docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md) | Touching any file in `src/data/`. |
| [docs/STATE.md](docs/STATE.md) | Adding state or an action. |
| [docs/PERSISTENCE.md](docs/PERSISTENCE.md) | Anything involving `localStorage`. |
| [docs/VITE.md](docs/VITE.md) | Scaffolding, imports, conventions, scripts. |
| [docs/ASSETS.md](docs/ASSETS.md) | Rendering trip/board/photo art. |
| [docs/THEME.md](docs/THEME.md) | Any visual change. |
| [design-system/readme.md](design-system/readme.md) | The design system itself — tokens, component previews, adherence rules. |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Who owns what, branching, integration. |
| [docs/VERCEL.md](docs/VERCEL.md) | Deploying. |
| [docs/RESEARCH-LOG.md](docs/RESEARCH-LOG.md) | Append when AI research drives a decision. |

## The rule that matters most

**Store inputs, derive outputs.**

Persist: constraints, board picks, swipe verdicts, saved trip ids, enabled hack
ids. Never persist: tag profiles, match scores, bios, base or hacked totals.
Recompute those in a `useMemo`. A stored total is how a demo ends up showing a
price that no longer matches the toggles above it.

## Relationship to the design handoff

`design/roamance-handoff/` was authored in parallel with the code, before any
source existed, so it describes a **different product**: Pinterest-style
discovery feeding an end-to-end booking flow with hotels, activities, flights,
and a confirmation reference.

What is adopted:

- The two front screens — vibe boards ("Your Type") and swipe refine ("Find
  Your Type") — replacing an earlier five-question quiz.
- The full visual language: accent ramps, radii, spacing, Work Sans, the
  step-nav, `%` match badges, tag chips. See [docs/THEME.md](docs/THEME.md).
- Its copy voice.

What is **not** adopted, and why:

- **Booking** (Stay / Interests / Fly tabs, "Make It Official", swap drawers).
  It needs hotel, activity, and flight datasets plus a fake checkout, and it
  breaks constraints 1–5. It also argues the opposite thing: a booking funnel
  optimises for completing a purchase, and this rebrand is about showing people
  what a cheap purchase actually costs them.
- **Destination scale.** The handoff shows Paros at an 11.5h flight and a
  $3,008 package. Our ten trips are short-haul and itemised.

Treat the handoff as the authority on **how it looks**, and this file plus
`src/lib/types.js` as the authority on **what it does**.

## Design in the codebase

`design-system/` is this app's design system in the shape Claude Design reads
when importing a design system from a codebase:

```
design-system/
  styles.css              generated from src/index.css — the only stylesheet
  readme.md               the written guide
  theme.json              machine-readable token record        (generated)
  thumbnail.html          the cover
  _ds_manifest.json       card index for the Design System pane (generated)
  _adherence.oxlintrc.json  no raw hex, no raw px, Work Sans only (generated)
  foundations/            color, type, spacing + elevation
  components/             buttons, chips, cards, forms, art
```

Each preview is plain HTML linking `../styles.css`, with a `@dsCard` marker on
line 1 that `build.mjs` compiles into the manifest.

Everything generated comes from `src/index.css`, so the design system and the
running app cannot disagree. **Never hand-edit a generated file.** Change a
token in `src/index.css`, run `npm run ds`, commit the result.

To pull this into Claude Design, run `/design-sync` from Claude Code in this
repo. That command is user-started — it is not something to invoke on someone's
behalf.

## Conventions

- Match the file you are editing. These modules carry heavy explanatory
  comments on purpose — the team is learning — so explain *why*, not *what*.
- `lib/` is pure: no React, no `window` except in `storage.js`.
- New data field → change the JSON, `types.js`, and `DATA-SCHEMA.md` in the
  same commit, and say so in the PR.
- `npm run build` and `npm run lint` must pass before you push.
- Changed a token in `src/index.css`, or added a design-system preview? Run
  `npm run ds` and commit the regenerated files. They are generated, never
  hand-edited.
