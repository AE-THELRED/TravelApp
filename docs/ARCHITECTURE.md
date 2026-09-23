# System Architecture

## One sentence

A Vite + React single-page app that reads three committed JSON files, scores
them against a tag profile derived from vibe-board picks and swipe verdicts in
pure functions, and keeps the user's inputs in `localStorage`.

## Diagram

```text
                    ┌─────────────────────────────────────────┐
                    │  Browser — the only runtime             │
                    │                                         │
 ┌────────────────┐ │  ┌───────────────────────────────────┐  │
 │ src/data/      │ │  │ App.jsx                           │  │
 │  trips.json    │─┼─▶│  useReducer(tripReducer)          │  │
 │  boards.json   │ │  │   constraints                     │  │
 │  swipes.json   │ │  │   picks[]   likes{}   ← INPUTS    │  │
 └────────────────┘ │  │   savedTrips  deckIndex  screen   │  │
                    │  └──────────────┬────────────────────┘  │
                    │       state + dispatch as PROPS         │
                    │                 │                        │
                    │  ┌──────────────▼────────────────────┐  │
                    │  │ screens/                          │  │
                    │  │  Landing → Onboarding → VibeBoards│  │
                    │  │  → SwipeRefine → Matches          │  │
                    │  │  → TripDetail → Saved             │  │
                    │  └──────────────┬────────────────────┘  │
                    │        useMemo( … ) — DERIVED           │
                    │                 │                        │
                    │  ┌──────────────▼────────────────────┐  │
                    │  │ lib/ — pure, no React, no window  │  │
                    │  │  buildProfile()  rankTrips()      │  │
                    │  │  applyHacks()    buildMatchLine() │  │
                    │  └──────────────┬────────────────────┘  │
                    │                 │                        │
                    │  ┌──────────────▼────────────────────┐  │
                    │  │ lib/storage.js — the only module  │  │
                    │  │ that touches localStorage         │  │
                    │  └───────────────────────────────────┘  │
                    └─────────────────────────────────────────┘
                                      │
                                      ▼
                       Static hosting. No server logic at all.
```

## Layers

### 1. Data — `src/data/`

| File | Holds |
|---|---|
| `trips.json` | 10 `Trip` objects: tags, itemised `cost`, `assumptions`, `tripBio`, 3–4 `hacks`. |
| `boards.json` | 6 `VibeBoard` objects — the coarse aesthetic signal. |
| `swipes.json` | 8 `SwipePhoto` objects — the refinement signal. |

Imported statically (`import trips from "../data/trips.json"`). Vite bundles
JSON imports directly; there is no fetch. **Nobody mutates this at runtime.**

### 2. Logic — `src/lib/`

Pure, dependency-free, no React import, no `window` (except `storage.js`).

| File | Key exports | Contract |
|---|---|---|
| `scoring.js` | `buildProfileTags(picks, likes, constraints)`, `buildProfile(…)`, `scoreTrip(profile, trip, constraints)`, `rankTrips(trips, profile, constraints)` | Deterministic. Boards weight +2, a crush +1.5, a pass −1, then normalised so the strongest dimension reads 5. Ranking is vibe-first — savings never enter it. |
| `cost.js` | `baseCost`, `availableHacks`, `applyHacks`, `basePerPerson`, `bestPerPerson`, `money` | Itemised group totals. Lodging is a whole-unit nightly rate divided by travellers — that is what makes group-splitting visible. Never returns a total below the floor. |
| `bio.js` | `buildMatchLine`, `reasonChips` | Assembled from pre-authored fragments. No LLM. |
| `storage.js` | `loadState`, `saveState`, `clearState` | One versioned key. Every access wrapped in try/catch. |

### 3. State — `src/state/tripReducer.js`

One `useReducer` in `App.jsx`. `state` and `dispatch` go down as props.

**No Context, deliberately.** The tree is three levels deep; for a team working
in parallel and learning React at the same time, prop-drilling is easier to
follow than a provider, and it makes every data dependency visible in the JSX.

See [STATE.md](STATE.md).

### 4. View — `src/screens/` and `src/components/`

Screens own their own local `useState` and call into `lib/` inside a `useMemo`.
Components are presentational and take props.

## Data flow, end to end

1. `Onboarding` collects `TripConstraints` → `SET_CONSTRAINTS` → screen becomes
   `vibe`.
2. `VibeBoards` toggles board ids → `TOGGLE_BOARD`.
3. `SwipeRefine` records verdicts → `SET_LIKE`, then `COMMIT_VIBE`.
4. `Matches` computes `buildProfile(picks, likes, constraints)` and
   `rankTrips(trips, profile, constraints)` in a `useMemo` and renders the deck.
5. Save → `SAVE_TRIP` (idempotent, and advances the deck). Pass → `ADVANCE_DECK`.
6. `TripDetail` calls `applyHacks(trip, constraints, enabledIds)` on every
   toggle and renders base vs. hacked cost, the savings, and one tradeoff line
   per enabled hack.
7. `Saved` re-derives every cost with `applyHacks` so nothing stale is shown.
8. An effect in `App.jsx` writes state to `localStorage` after every change,
   but never before hydration.

## The rule

**Store inputs, derive outputs.**

| Persisted | Derived every render |
|---|---|
| `constraints` | tag profile |
| `picks`, `likes` | match scores and ordering |
| `savedTrips[].tripId` | bios and reason chips |
| `savedTrips[].selectedHackIds` | base totals, hacked totals, savings, tradeoffs |

## Module boundary rules

- A screen may import from `lib/`, `state/`, `components/`, `data/`.
- `lib/` may not import from `components/`, `screens/`, or `state/`.
- Only `lib/storage.js` references `window`.
- Only `App.jsx` owns the reducer. Screens dispatch; they never mutate state.
- A new data field changes the JSON, `types.js`, and `DATA-SCHEMA.md` in one
  commit.

## Non-goals

Real booking or checkout, live pricing, scraping, accounts, multi-device sync,
server-side rendering, maps requiring an API key, analytics, i18n.
