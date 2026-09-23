# Roamance

**Stop searching for trips. Meet one.**

A front-end-only prototype that rebrands mainstream trip booking — Expedia,
Kayak, Booking — around one argument:

> Booking sites compete on the lowest headline number and hide what it costs
> you. Roamance shows the saving and the tradeoff in the same breath.

You pick aesthetic **vibe boards**, refine on eight photos, and meet ten
destination "profiles" ranked against the taste that produces. Each match opens
a **true-cost card** with a **Hack Stack**: toggleable money-saving strategies
that move the estimate and always name what they cost you — three flights of
stairs, a 40-minute shuttle wait, someone on the pull-out couch.

All prices are **estimated prototype data**. No booking, no live pricing, no
accounts, no external API.

## Live demo

Production: `<paste the deployment URL here>`

## Quick start

```bash
git clone https://github.com/AE-THELRED/TravelApp.git
cd TravelApp
npm install
npm run dev        # http://localhost:5173
```

Before pushing:

```bash
npm run build && npm run lint
```

## Stack

| Concern | Choice |
|---|---|
| Build | Vite |
| UI | React 19, plain JavaScript |
| Types | JSDoc typedefs in `src/lib/types.js` |
| Routing | None — one `screen` string in the reducer |
| State | One `useReducer` in `App.jsx`, passed as props |
| Persistence | `localStorage`, one versioned key |
| Data | Committed static JSON |
| Art | Generated SVG — no photography, no image files |
| Lint | oxlint |
| Backend | None |

## Screens

`landing` → `onboarding` (who, how long, what budget) → `vibe` (board picker) →
`swipe` (refine on eight photos) → `matches` (ranked deck of ten) → `detail`
(true cost + Hack Stack) → `saved` (compare)

Screens that are not built yet render a visible `NotBuiltYet` placeholder
rather than a blank page.

## Status

**The prototype runs end to end.** All seven screens are built, and the full
click path is verified by an automated browser walk ([`scripts/smoke.mjs`](scripts/smoke.mjs)):
landing → onboarding → vibe → swipe → matches → detail → saved, plus reload
persistence and reset.

What that walk asserts, every run: the deck is exactly ten trips in descending
match order with no duplicates; two contrasting vibe profiles produce different
top matches; toggling a hack moves the total and never renders a negative or
`NaN`; a hack whose requirement is unmet is not offered; reload restores the
session; reset clears storage and returns to the landing screen.

Remaining work is polish, not structure — see the cut list in
[docs/WORKFLOW.md](docs/WORKFLOW.md).

## Documentation

Start with [CLAUDE.md](CLAUDE.md) — the entry point for AI coding assistants
and for humans.

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layers, data flow, module boundaries
- [docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md) — building `trips.json`, `boards.json`, `swipes.json`
- [docs/STATE.md](docs/STATE.md) — state shape, actions, what is derived
- [docs/PERSISTENCE.md](docs/PERSISTENCE.md) — the `localStorage` contract
- [docs/VITE.md](docs/VITE.md) — scaffold, imports, conventions, gotchas
- [docs/ASSETS.md](docs/ASSETS.md) — the generated-SVG art system
- [docs/THEME.md](docs/THEME.md) — retheme the app from one file
- [design-system/readme.md](design-system/readme.md) — the importable design system
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — phases, branching, review, integration
- [docs/VERCEL.md](docs/VERCEL.md) — deployment and build triage
- [docs/RESEARCH-LOG.md](docs/RESEARCH-LOG.md) — AI-assisted research decisions

## Design

`design/roamance-handoff/` holds the art direction: an interactive prototype,
the design-system CSS, and screenshots of all five designed screens.

`design-system/` is the importable design system built from the app's own
tokens and components — foundation and component previews, a generated
`theme.json` and card manifest, and adherence rules. It is what Claude Design
reads when the design system is imported from this codebase; see
[design-system/readme.md](design-system/readme.md).

The handoff was authored in parallel with the code, before any source existed,
so it describes a **different product** — mood-board discovery feeding an end-to-end
booking flow. Its visual language and its two front screens are adopted; its
booking flow is not. [CLAUDE.md](CLAUDE.md) explains that split in full.

## Non-goals

Real bookings, live prices, scraping, accounts, multi-device sync, runtime LLM
calls, maps requiring an API key.
