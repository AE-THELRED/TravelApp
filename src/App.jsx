import { useEffect, useReducer } from "react";
import { initialState, tripReducer } from "./state/tripReducer.js";
import { loadState, saveState, clearState } from "./lib/storage.js";
import Landing from "./screens/Landing.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import VibeBoards from "./screens/VibeBoards.jsx";
import SwipeRefine from "./screens/SwipeRefine.jsx";
import Matches from "./screens/Matches.jsx";
import TripDetail from "./screens/TripDetail.jsx";
import Saved from "./screens/Saved.jsx";

/**
 * App shell — shared. Both phases register a screen here.
 *
 * Owns the single reducer and the two persistence effects. Every screen gets
 * `state` and `dispatch` as props; there is no Context by design.
 *
 * The flow:
 *   landing → onboarding → vibe → swipe → matches → detail → saved
 *
 * Screens that need constraints are gated on them rather than rendered against
 * a null: a reload straight into /matches with cleared storage would otherwise
 * divide by a party size that doesn't exist.
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

  // Hydration reads storage in an effect, i.e. after first paint. Without this
  // gate a returning user sees the landing screen for one frame before HYDRATE
  // flips them to their deck — the flash docs/STATE.md warns about.
  if (!state.hydrated) return <div className="app" />;

  // Every screen past onboarding prices against `constraints`. If it is
  // missing — cleared storage, or a link straight into the deck — send the
  // user to collect it rather than rendering a screen full of NaN.
  const needsConstraints = ["vibe", "swipe", "matches", "detail", "saved"];
  const screen =
    needsConstraints.includes(state.screen) && !state.constraints ? "onboarding" : state.screen;

  const screens = {
    landing: <Landing dispatch={dispatch} hasVibe={state.picks.length > 0} />,
    onboarding: <Onboarding state={state} dispatch={dispatch} />,
    vibe: <VibeBoards state={state} dispatch={dispatch} />,
    swipe: <SwipeRefine state={state} dispatch={dispatch} />,
    matches: <Matches state={state} dispatch={dispatch} />,
    detail: <TripDetail state={state} dispatch={dispatch} />,
    saved: <Saved state={state} dispatch={dispatch} />,
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

      {screens[screen] ?? <NotBuiltYet screen={screen} dispatch={dispatch} />}
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
