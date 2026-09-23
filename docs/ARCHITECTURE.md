# System Architecture

## One-sentence summary

A statically rendered Next.js single-page-feeling app that reads one committed JSON dataset, scores it against quiz answers in pure client-side functions, and stores user choices in `localStorage`.

## Diagram

```text
                        ┌──────────────────────────────┐
                        │  Browser (only runtime)      │
                        │                              │
  ┌──────────────┐      │  ┌────────────────────────┐  │
  │ trips.json   │─────▶│  │ TripProvider (Context) │  │
  │ (committed)  │      │  │  constraints           │  │
  └──────────────┘      │  │  travelerProfile       │  │
                        │  │  savedTrips            │  │
  ┌──────────────┐      │  │  deckIndex             │  │
  │ /public/     │─────▶│  └───────┬────────────────┘  │
  │ images       │      │          │                    │
  └──────────────┘      │  ┌───────▼────────────────┐  │
                        │  │ Screens                │  │
                        │  │  Landing               │  │
                        │  │  Onboarding            │  │
                        │  │  Quiz                  │  │
                        │  │  Matches (swipe deck)  │  │
                        │  │  TripDetail + HackStack│  │
                        │  │  Saved                 │  │
                        │  └───────┬────────────────┘  │
                        │          │                    │
                        │  ┌───────▼────────────────┐  │
                        │  │ lib/ pure functions    │  │
                        │  │  scoreTrip()           │  │
                        │  │  rankTrips()           │  │
                        │  │  buildBio()            │  │
                        │  │  applyHacks()          │  │
                        │  └───────┬────────────────┘  │
                        │          │                    │
                        │  ┌───────▼────────────────┐  │
                        │  │ localStorage adapter   │  │
                        │  └────────────────────────┘  │
                        └──────────────────────────────┘
                                      │
                                      ▼
                        Vercel static/edge hosting (no server logic)
```

## Layers and responsibilities

### 1. Data layer — `src/data/`
- `trips.json` — array of Trip objects (see [DATA-SCHEMA.md](DATA-SCHEMA.md)).
- `quiz.json` — questions, answer options, and the tag weights each answer contributes.
- Imported statically (`import trips from "@/data/trips.json"`). No fetching.
- **Nobody mutates this data at runtime.** Treat it as read-only.

### 2. Logic layer — `src/lib/`
All pure, dependency-free, unit-testable functions. This is the only place scoring or cost math lives.

| File | Exports | Contract |
|---|---|---|
| `scoring.js` | `scoreTrip(profile, trip, constraints)` → `0–100` | Deterministic. Same inputs always give the same score. |
| `scoring.js` | `rankTrips(trips, profile, constraints)` → sorted array of `{ trip, matchScore, reasons }` | `reasons` is an array of short strings used for the "why you match" copy. |
| `bio.js` | `buildBio(trip, profile)` → string | Assembles a bio from `trip.tripBio` plus template fragments keyed on top matching tags. No LLM. |
| `cost.js` | `applyHacks(trip, constraints, enabledHackIds)` → `{ baseTotal, hackedTotal, perPerson, savings, tradeoffs[] }` | Never returns a negative total; clamp at a floor. |
| `storage.js` | `loadState()`, `saveState(partial)`, `clearState()` | The only module that touches `localStorage`. |

### 3. State layer — `src/context/`
One React Context + `useReducer` store. See [STATE.md](STATE.md).

### 4. View layer — `src/components/` and `src/app/`
Presentational components receive data via props from screen-level components. Screens read from Context. No component calls `localStorage` or `scoreTrip` directly except its owning screen.

## Data flow, end to end

1. `Onboarding` collects `TripConstraints` → `dispatch({ type: "SET_CONSTRAINTS" })` → reducer updates state → effect writes to `localStorage`.
2. `Quiz` collects answers → maps through `quiz.json` weights → `dispatch({ type: "SET_PROFILE" })`.
3. `Matches` calls `rankTrips(trips, profile, constraints)` inside a `useMemo` and renders the top 10 as a card stack.
4. Swipe right → `dispatch({ type: "SAVE_TRIP", tripId })`. Swipe left → `dispatch({ type: "ADVANCE_DECK" })`.
5. `TripDetail` calls `applyHacks(...)` on every toggle and renders base vs. hacked cost, savings, and the accumulated tradeoff list.
6. `Saved` reads `savedTrips` and re-derives costs with `applyHacks` so nothing stale is stored.

**Rule: store inputs, derive outputs.** Persist quiz answers, constraints, saved trip IDs, and enabled hack IDs. Never persist computed scores or totals — recompute them.

## Module boundary rules for Claude Code

- A component may import from `lib/` and `context/`. `lib/` may not import from `components/` or `context/`.
- Only `lib/storage.js` references `window`.
- Only `context/TripProvider` owns the reducer. Screens dispatch; they do not mutate.
- New data fields go in `trips.json` and `DATA-SCHEMA.md` together, in the same commit.

## Explicit non-goals

Real booking or checkout, live flight/hotel pricing, scraping, user accounts, multi-device sync, server-side rendering of personalized content, maps requiring an API key, analytics, i18n.
