import { useEffect, useReducer } from "react";
import { initialState, tripReducer } from "./state/tripReducer.js";
import { loadState, saveState, clearState } from "./lib/storage.js";
import Landing from "./screens/Landing.jsx";

/**
 * App shell — Person 4.
 *
 * Owns the single reducer and the two persistence effects. Every screen gets
 * `state` and `dispatch` as props; there is no Context by design.
 *
 * Screens still to build (see docs/WORKFLOW.md for who owns which):
 *   onboarding  Phase C   constraints form — who, how long, what budget
 *   vibe        Phase A   "Your Type" — vibe-board picker
 *   swipe       Phase A   "Find Your Type" — refine on 8 photos
 *   matches     Phase B   ranked deck
 *   detail      Phase B   true-cost card + Hack Stack
 *   saved       Phase C   saved matches and group split
 */
export default function App() {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  // Hydrate once, on the client, after first paint.
  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadState() });
  }, []);

  // Persist on change, but never before hydration — otherwise the empty
  // initial state overwrites what is already in storage.
  useEffect(() => {
    if (!state.hydrated) return;
    saveState(state);
  }, [state]);

  function resetDemo() {
    clearState();
    dispatch({ type: "RESET_ALL" });
  }

  const screens = {
    landing: <Landing dispatch={dispatch} hasVibe={state.picks.length > 0} />,
  };

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="wordmark"
          style={{ background: "none", border: "none", padding: 0 }}
          onClick={() => dispatch({ type: "GO", screen: "landing" })}
        >
          Ro<em>a</em>mance
        </button>
        <div className="topbar__actions">
          {state.savedTrips.length > 0 && (
            <button className="btn btn--ghost" onClick={() => dispatch({ type: "GO", screen: "saved" })}>
              Saved · {state.savedTrips.length}
            </button>
          )}
          <button className="btn btn--ghost" onClick={resetDemo}>
            Reset
          </button>
        </div>
      </header>

      {screens[state.screen] ?? <NotBuiltYet screen={state.screen} dispatch={dispatch} />}
    </div>
  );
}

/** Placeholder so an unbuilt screen is an obvious TODO, not a blank page. */
function NotBuiltYet({ screen, dispatch }) {
  return (
    <div className="screen stack">
      <span className="eyebrow">Not built yet</span>
      <h1 style={{ fontSize: "28px" }}>The &ldquo;{screen}&rdquo; screen is still empty.</h1>
      <p className="muted">
        The data contract, scoring, and cost math are committed and ready to build against. See
        WORKFLOW.md for who owns this one.
      </p>
      <div>
        <button className="btn" onClick={() => dispatch({ type: "GO", screen: "landing" })}>
          Back to landing
        </button>
      </div>
    </div>
  );
}
