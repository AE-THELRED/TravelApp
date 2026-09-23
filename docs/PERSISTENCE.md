# Persistence — localStorage

## Why localStorage is enough

`localStorage` returns a `Storage` object scoped to the document's origin, data has no expiration time, and it survives across browser sessions; keys and values are stored as UTF‑16 strings, so everything must be serialized ([MDN `localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)). That covers the demo requirement: close the tab, reopen the site, quiz result and saved trips are still there. No accounts, no sync, no database.

## Storage keys

Use a single namespaced key holding one JSON blob. One key means one read, one write, and one place to version.

```text
travelhacker:v1:state
```

Do not scatter `travelhacker:constraints`, `travelhacker:saved`, etc. If the schema changes in a breaking way, bump to `v2` and ignore `v1` rather than writing a migration.

## Persisted shape

Only inputs are persisted. Everything else is recomputed on load.

```json
{
  "version": 1,
  "constraints": { "departure": "CLT", "destinationPref": "surprise", "nights": 3,
                   "adults": 4, "children": 0, "childAges": [], "budgetTier": 2 },
  "travelerProfile": {
    "answers": { "q1": "relaxed", "q2": "food", "q3": "loose", "q4": "save" },
    "tags": { "food": 5, "nightlife": 3, "nature": 1, "culture": 3, "beach": 2,
              "relaxation": 4, "activity": 2, "budgetSensitivity": 5, "planningStyle": 1 }
  },
  "savedTrips": [
    { "tripId": "new-orleans", "savedAt": 1758000000000,
      "selectedHackIds": ["date-flex", "alt-lodging"] }
  ],
  "deckIndex": 3
}
```

Never persist: `matchScore`, `tripBio`, `baseTotal`, `hackedTotal`, `savings`, `tradeoffs`, or the trips array itself.

## `src/lib/storage.ts` — the only module that touches storage

```ts
const KEY = "travelhacker:v1:state";
const VERSION = 1;

const isBrowser = () => typeof window !== "undefined";

export function loadState(): Partial<AppState> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed?.version !== VERSION) return {};   // drop incompatible data
    return {
      constraints: parsed.constraints ?? null,
      travelerProfile: parsed.travelerProfile ?? null,
      savedTrips: Array.isArray(parsed.savedTrips) ? parsed.savedTrips : [],
      deckIndex: typeof parsed.deckIndex === "number" ? parsed.deckIndex : 0,
    };
  } catch {
    return {};                                     // corrupt JSON or blocked storage
  }
}

export function saveState(state: AppState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({
      version: VERSION,
      constraints: state.constraints,
      travelerProfile: state.travelerProfile,
      savedTrips: state.savedTrips,
      deckIndex: state.deckIndex,
    }));
  } catch {
    /* quota exceeded or private-mode denial: fail silently, keep the app usable */
  }
}

export function clearState(): void {
  if (!isBrowser()) return;
  try { window.localStorage.removeItem(KEY); } catch {}
}
```

## SSR safety — the one thing that will break your build

Next.js renders components on the server first, where `window` does not exist. Rules:

1. Never call `loadState()` at module scope or as a `useState` initializer.
2. Read storage only inside `useEffect` (client-only), then `dispatch({ type: "HYDRATE" })`.
3. Render the same markup on server and first client paint. Gate storage-dependent UI on `state.hydrated` to avoid hydration mismatch warnings.
4. Every access is wrapped in `try/catch` — storage can be disabled or full, and both throw.

## Reset affordance

Ship a visible "Reset demo" control (footer or Saved screen) that dispatches `RESET_ALL` and calls `clearState()`. You will need it repeatedly while presenting, and it is a one-line safety net if the stored state ever gets into a bad shape.
