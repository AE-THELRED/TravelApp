import EstimateBadge from "../components/EstimateBadge.jsx";

/**
 * Landing — shared.
 * Sets the premise in one line, then gets out of the way.
 */
export default function Landing({ dispatch, hasVibe }) {
  return (
    <div className="screen stack--lg stack">
      <div className="stack">
        <span className="eyebrow">Roamance</span>
        <h1 style={{ fontSize: "clamp(32px, 8vw, 46px)" }}>
          Stop searching for trips.
          <br />
          <span style={{ color: "var(--coral)" }}>Meet one.</span>
        </h1>
        <p className="muted" style={{ fontSize: "17px", maxWidth: "42ch" }}>
          Pick the places that already look like your trip. We&rsquo;ll introduce you to ten
          destinations that match — then show you exactly what each one would cost, and what
          every shortcut actually costs you.
        </p>
      </div>

      <div className="stack">
        <button className="btn btn--primary btn--block" onClick={() => dispatch({ type: "GO", screen: "onboarding" })}>
          {hasVibe ? "Start over" : "Find your type"}
        </button>
        {hasVibe && (
          <button className="btn btn--block" onClick={() => dispatch({ type: "GO", screen: "matches" })}>
            Back to your deck
          </button>
        )}
      </div>

      <div className="stack stack--sm">
        <EstimateBadge>
          All prices are estimated prototype data. No booking, no live pricing, no accounts.
        </EstimateBadge>
      </div>
    </div>
  );
}
