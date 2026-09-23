/**
 * The one store — Person 4.
 *
 * A single useReducer lives in App.jsx and its state and dispatch are passed
 * down as props. No Context: the tree is three levels deep and prop-drilling is
 * easier to follow than a provider for a team working in parallel.
 *
 * The reducer is a pure function of (state, action). No localStorage writes, no
 * Date.now() except where an action carries it in, no randomness. Persistence
 * happens in an effect in App.jsx, not here.
 *
 * Global state is exactly these things. Everything else — which swipe card is
 * on top, whether a drawer is open, drag position — is local useState in the
 * component that owns it. Resist adding to this.
 *
 * Note what is NOT here: the traveler's tag profile. `picks` and `likes` are
 * inputs and they persist; the tag vector is derived from them with
 * `buildProfile()` in a useMemo. Storing it would let a stale profile outlive
 * the answers that produced it.
 */

/** @type {import("../lib/types.js").AppState} */
export const initialState = {
  constraints: null,
  picks: [],
  likes: {},
  savedTrips: [],
  deckIndex: 0,
  hydrated: false,
  screen: "landing",
  activeTripId: null,
};

export function tripReducer(state, action) {
  switch (action.type) {
    // Merge persisted values exactly once, from the hydration effect.
    case "HYDRATE": {
      const p = action.payload ?? {};
      const next = { ...state, ...p, hydrated: true };
      // Returning users who already picked a vibe land on their deck, not the splash.
      if (state.screen === "landing" && p.constraints && p.picks?.length) {
        next.screen = "matches";
      }
      return next;
    }

    case "GO":
      return { ...state, screen: action.screen, activeTripId: action.tripId ?? null };

    // Replaces wholesale. Does NOT clear savedTrips — editing your trip length
    // should re-price what you saved, not delete it.
    case "SET_CONSTRAINTS":
      return { ...state, constraints: action.payload, screen: "vibe" };

    // Vibe boards. Selection is a toggle so the grid needs no separate remove.
    case "TOGGLE_BOARD": {
      const on = state.picks.includes(action.boardId);
      return {
        ...state,
        deckIndex: 0, // the ranking is about to change
        picks: on
          ? state.picks.filter((id) => id !== action.boardId)
          : [...state.picks, action.boardId],
      };
    }

    // One swipe verdict. `liked: null` clears it, which is how "undo" works.
    case "SET_LIKE": {
      const likes = { ...state.likes };
      if (action.liked === null || action.liked === undefined) delete likes[action.photoId];
      else likes[action.photoId] = action.liked;
      return { ...state, likes, deckIndex: 0 };
    }

    // Both vibe screens are done — go meet the deck.
    case "COMMIT_VIBE":
      return { ...state, deckIndex: 0, screen: "matches" };

    // "Edit vibe" from the matches rail. Keeps picks and likes intact.
    case "EDIT_VIBE":
      return { ...state, screen: "vibe" };

    case "ADVANCE_DECK":
      return { ...state, deckIndex: state.deckIndex + 1 };

    // Idempotent, and advances the deck so a right-swipe does one thing.
    case "SAVE_TRIP": {
      if (state.savedTrips.some((s) => s.tripId === action.tripId)) {
        return { ...state, deckIndex: state.deckIndex + 1 };
      }
      return {
        ...state,
        deckIndex: state.deckIndex + 1,
        savedTrips: [
          ...state.savedTrips,
          { tripId: action.tripId, savedAt: action.savedAt, selectedHackIds: [] },
        ],
      };
    }

    case "UNSAVE_TRIP":
      return {
        ...state,
        savedTrips: state.savedTrips.filter((s) => s.tripId !== action.tripId),
      };

    // Toggling a hack on an unsaved trip saves it first — you cannot hold hack
    // selections for something that is not on your board.
    case "TOGGLE_HACK": {
      const exists = state.savedTrips.some((s) => s.tripId === action.tripId);
      const saved = exists
        ? state.savedTrips
        : [
            ...state.savedTrips,
            { tripId: action.tripId, savedAt: action.savedAt, selectedHackIds: [] },
          ];

      return {
        ...state,
        savedTrips: saved.map((s) => {
          if (s.tripId !== action.tripId) return s;
          const on = s.selectedHackIds.includes(action.hackId);
          return {
            ...s,
            selectedHackIds: on
              ? s.selectedHackIds.filter((id) => id !== action.hackId)
              : [...s.selectedHackIds, action.hackId],
          };
        }),
      };
    }

    case "RESET_ALL":
      return { ...initialState, hydrated: true };

    default:
      return state;
  }
}

/** Selected hack ids for a trip, or an empty array if it is not saved. */
export function selectedHackIds(state, tripId) {
  return state.savedTrips.find((s) => s.tripId === tripId)?.selectedHackIds ?? [];
}

export function isSaved(state, tripId) {
  return state.savedTrips.some((s) => s.tripId === tripId);
}
