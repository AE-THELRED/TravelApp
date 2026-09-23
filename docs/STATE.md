# Local Component State

## Rule of thumb

- **Local `useState`** for anything one component owns and no one else reads: current quiz question index, whether a drawer is open, hover/drag state on a card, form field values before submit.
- **Context + `useReducer`** for the four things multiple screens need: `constraints`, `travelerProfile`, `savedTrips`, `deckIndex`.
- Nothing else is global. Resist adding to the store.

`useReducer` returns `[state, dispatch]` and its reducer must be a pure function of `(state, action)` that returns the next state ([React `useReducer`](https://react.dev/reference/react/useReducer)). Keep every reducer case free of `localStorage` writes, `Date.now()`, and random values — persistence happens in an effect, not in the reducer.

## Types — `src/context/types.ts`

```ts
export type TagKey =
  | "food" | "nightlife" | "nature" | "culture" | "beach"
  | "relaxation" | "activity" | "budgetSensitivity" | "planningStyle";

export interface TripConstraints {
  departure: string;
  destinationPref: "specific" | "region" | "surprise";
  destinationValue?: string;   // set when destinationPref !== "surprise"
  nights: number;
  adults: number;
  children: number;
  childAges: number[];
  budgetTier: 1 | 2 | 3;
}

export interface TravelerProfile {
  answers: Record<string, string>;      // questionId -> optionId
  tags: Record<TagKey, number>;         // 0–5 weights derived from answers
}

export interface SavedTrip {
  tripId: string;
  savedAt: number;
  selectedHackIds: string[];
}

export interface AppState {
  constraints: TripConstraints | null;
  travelerProfile: TravelerProfile | null;
  savedTrips: SavedTrip[];
  deckIndex: number;
  hydrated: boolean;      // false until localStorage has been read
}
```

## Actions — `src/context/tripReducer.ts`

```ts
export type Action =
  | { type: "HYDRATE"; payload: Partial<AppState> }
  | { type: "SET_CONSTRAINTS"; payload: TripConstraints }
  | { type: "SET_PROFILE"; payload: TravelerProfile }
  | { type: "ADVANCE_DECK" }
  | { type: "SAVE_TRIP"; tripId: string }
  | { type: "UNSAVE_TRIP"; tripId: string }
  | { type: "TOGGLE_HACK"; tripId: string; hackId: string }
  | { type: "RESET_ALL" };
```

Behavior contracts:

| Action | Must do |
|---|---|
| `HYDRATE` | Merge persisted values, set `hydrated: true`. Only dispatched once, from `TripProvider`. |
| `SET_CONSTRAINTS` | Replace wholesale. Does not clear `savedTrips`. |
| `SET_PROFILE` | Replace wholesale and reset `deckIndex` to `0`. |
| `SAVE_TRIP` | No-op if `tripId` already saved. Also advances the deck. |
| `TOGGLE_HACK` | If the trip is not saved yet, save it first, then toggle. Toggle is idempotent per id. |
| `RESET_ALL` | Return the initial state and clear storage (the clearing happens in the persistence effect, keyed on the state change). |

## Provider shape — `src/context/TripProvider.tsx`

```tsx
"use client";
const TripContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  useEffect(() => {                       // hydrate once, client-side only
    dispatch({ type: "HYDRATE", payload: loadState() });
  }, []);

  useEffect(() => {                       // persist on change, after hydration
    if (!state.hydrated) return;
    saveState(state);
  }, [state]);

  return <TripContext.Provider value={{ state, dispatch }}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside <TripProvider>");
  return ctx;
}
```

## Derived values — never stored

Compute these with `useMemo` in the screen that renders them:

```ts
const ranked = useMemo(
  () => rankTrips(trips, profile, constraints),
  [profile, constraints]
);

const cost = useMemo(
  () => applyHacks(trip, constraints, selectedHackIds),
  [trip, constraints, selectedHackIds]
);
```

Match scores, bios, base totals, hacked totals, savings, and tradeoff lists are all derived. If you find yourself putting one in the reducer, stop.

## Common pitfalls in this project

- Rendering saved trips before `hydrated` is `true` causes a flash of an empty list. Gate on `state.hydrated`.
- Mutating `state.savedTrips` with `push` instead of returning a new array — React will not re-render. Always spread.
- Putting the quiz's current question index in Context. It is local to `<Quiz />`.
- Recomputing `rankTrips` on every keystroke because `constraints` is rebuilt as a new object each render. Only dispatch on submit.
