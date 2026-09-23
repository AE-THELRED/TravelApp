# Persistence

`src/lib/storage.js` is the **only** module in the app that touches
`localStorage`. If you are about to type `window.localStorage` anywhere else,
don't — add a function here instead.

## The key

```js
const KEY = "roamance:v1:state";
const VERSION = 2;
```

One namespaced key holding one JSON blob: one read, one write, one place to
version.

`KEY` is the namespace and does not change. `VERSION` is inside the payload and
is what actually gates compatibility. On read, a payload whose `version` does
not match is **dropped, not migrated** — a prototype has no users whose data is
worth a migration path, and a half-migrated blob is a much worse demo bug than
an empty one.

`VERSION` went to 2 when the five-question quiz was replaced by vibe boards and
swipes: the persisted `travelerProfile` no longer had a meaning, so v1 data is
discarded on read rather than rehydrated into a profile nothing can score.

**Bump `VERSION` whenever you change what is persisted in a breaking way.**

## What is persisted

Only inputs:

```js
{
  version: 2,
  constraints,   // TripConstraints | null
  picks,         // string[]
  likes,         // { [photoId]: boolean }
  savedTrips,    // SavedTrip[] — tripId, savedAt, selectedHackIds
  deckIndex,     // number
}
```

Never persisted: the tag profile, match scores, bios, base totals, hacked
totals, savings, tradeoff lists. All recomputed on load. Storing a derived
number is how a demo ends up showing a price that no longer matches the toggles
above it.

## The two effects, in `App.jsx`

```jsx
// Hydrate once, on the client, after first paint.
useEffect(() => {
  dispatch({ type: "HYDRATE", payload: loadState() });
}, []);

// Persist on change — but never before hydration, or the empty initial state
// overwrites what is already in storage.
useEffect(() => {
  if (!state.hydrated) return;
  saveState(state);
}, [state]);
```

The `hydrated` guard is the important half. Without it the first render writes
an empty state over real saved data before the read has happened.

## Everything is wrapped

Storage throws in more situations than people expect: disabled in private
windows, over quota, or holding JSON that something else corrupted. All three
throw, and an uncaught throw in an effect blanks the screen.

Every access in `storage.js` is inside `try/catch`, and every failure path
returns something usable rather than propagating:

- `loadState()` returns `{}` — start clean, stay usable.
- `saveState()` fails silently. Losing persistence mid-demo is survivable;
  crashing is not.
- `clearState()` fails silently.

## Reset

`App.jsx` owns the reset button:

```js
function resetDemo() {
  clearState();
  dispatch({ type: "RESET_ALL" });
}
```

Both halves, in that order. The reducer never clears storage itself — it is a
pure function, and clearing is a side effect.

Reset has to work, every time, on the first click: it is how the demo gets run
twice in a row in front of an audience.

## Testing it by hand

```js
// In the browser console:
localStorage.getItem("roamance:v1:state");   // inspect
localStorage.removeItem("roamance:v1:state"); // simulate a first-time visitor
```

Before you call persistence done: complete the flow, save two trips, toggle a
couple of hacks, reload, and confirm the constraints, the vibe picks, the swipe
verdicts, the saved trips, and the selected hacks all come back — and that the
prices are recomputed rather than restored.
