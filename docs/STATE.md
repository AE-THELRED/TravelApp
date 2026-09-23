# State

## Rule of thumb

- **Local `useState`** for anything one component owns and nobody else reads:
  which swipe card is on top, whether a drawer is open, drag position, form
  field values before submit.
- **The reducer** for the six things multiple screens need: `constraints`,
  `picks`, `likes`, `savedTrips`, `deckIndex`, `screen`.
- Nothing else is global. Resist adding to it.

There is **no Context**. One `useReducer` lives in `App.jsx` and `state` and
`dispatch` are passed down as props. The tree is three levels deep, and for a
team learning React in parallel, a visible prop beats an invisible provider.

## Shape — `src/lib/types.js` (`AppState`)

```js
{
  constraints: null,   // TripConstraints | null
  picks: [],           // string[]  selected vibe-board ids
  likes: {},           // { [photoId]: boolean }  true = crush, false = pass
  savedTrips: [],      // SavedTrip[]
  deckIndex: 0,
  hydrated: false,     // false until localStorage has been read
  screen: "landing",   // landing|onboarding|vibe|swipe|matches|detail|saved
  activeTripId: null,
}
```

Note what is **not** here: the traveler's tag profile. `picks` and `likes` are
the inputs; the tag vector is derived from them with `buildProfile()` in a
`useMemo`. Storing it would let a stale profile outlive the answers that
produced it.

## Actions

| Action | Payload | Must do |
|---|---|---|
| `HYDRATE` | `payload` | Merge persisted values, set `hydrated: true`. Dispatched once, from the effect in `App.jsx`. A returning user with constraints and at least one pick lands on `matches`, not the splash. |
| `GO` | `screen`, `tripId?` | Navigate. Sets `activeTripId`. |
| `SET_CONSTRAINTS` | `payload` | Replace wholesale, then go to `vibe`. Does **not** clear `savedTrips` — editing trip length should re-price what you saved, not delete it. |
| `TOGGLE_BOARD` | `boardId` | Add or remove from `picks`. Resets `deckIndex` — the ranking is about to change. |
| `SET_LIKE` | `photoId`, `liked` | Record a verdict. `liked: null` deletes the key, which is how undo works. Resets `deckIndex`. |
| `COMMIT_VIBE` | — | Both vibe screens are done; go to `matches`. |
| `EDIT_VIBE` | — | Back to `vibe`, keeping picks and likes. |
| `ADVANCE_DECK` | — | `deckIndex + 1`. |
| `SAVE_TRIP` | `tripId`, `savedAt` | Idempotent. Also advances the deck, so a right-swipe does exactly one thing. |
| `UNSAVE_TRIP` | `tripId` | Remove. |
| `TOGGLE_HACK` | `tripId`, `hackId`, `savedAt` | If the trip is not saved yet, save it first — you cannot hold hack selections for something that is not on your board. Toggle is idempotent per id. |
| `RESET_ALL` | — | Return to the initial state with `hydrated: true`. Clearing storage happens in `App.jsx`, not here. |

The reducer is a pure function of `(state, action)`. **No `localStorage` writes,
no `Date.now()`, no randomness.** Anything time-based is carried in on the
action — that is why `SAVE_TRIP` takes `savedAt`.

## Selectors

```js
import { selectedHackIds, isSaved } from "../state/tripReducer.js";

selectedHackIds(state, tripId)  // string[], empty if not saved
isSaved(state, tripId)          // boolean
```

## Derived values — never stored

Compute in the screen that renders them:

```js
const profile = useMemo(
  () => buildProfile(state.picks, state.likes, state.constraints),
  [state.picks, state.likes, state.constraints],
);

const ranked = useMemo(
  () => rankTrips(trips, profile, state.constraints),
  [profile, state.constraints],
);

const cost = useMemo(
  () => applyHacks(trip, state.constraints, enabledIds),
  [trip, state.constraints, enabledIds],
);
```

Match scores, bios, base totals, hacked totals, savings, and tradeoff lists are
all derived. If you find yourself putting one in the reducer, stop.

## Common pitfalls here

- Rendering saved trips before `hydrated` is `true` flashes an empty list. Gate
  on `state.hydrated`.
- Mutating `state.savedTrips` with `push` instead of returning a new array —
  React will not re-render. Always spread.
- Putting the current swipe index in the reducer. It is local to `SwipeRefine`.
- Rebuilding `constraints` as a fresh object every render, which invalidates
  every `useMemo` downstream. Only dispatch on submit.
- Reading `state.picks.length` to decide whether the vibe step is done, when
  what you want is `hasVibe(state.picks)` from `scoring.js`.
