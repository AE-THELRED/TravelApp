import { useMemo } from "react";
import trips from "../data/trips.json";
import Art from "../components/Art.jsx";
import Button from "../components/Button.jsx";
import Chip from "../components/Chip.jsx";
import EstimateBadge from "../components/EstimateBadge.jsx";
import { buildProfile, rankTrips } from "../lib/scoring.js";
import { basePerPerson, bestPerPerson, money } from "../lib/cost.js";
import { buildMatchLine } from "../lib/bio.js";
import { isSaved } from "../state/tripReducer.js";

/**
 * The deck.
 *
 * One featured match at a time — the "meet one" half of the premise — with the
 * rest of the ranking underneath so nothing is hidden. Everything here is
 * derived in a useMemo; not one number is read from storage.
 */
export default function Matches({ state, dispatch }) {
  const { constraints } = state;

  const ranked = useMemo(() => {
    const profile = buildProfile(state.picks, state.likes, constraints);
    return rankTrips(trips, profile, constraints);
  }, [state.picks, state.likes, constraints]);

  const cursor = Math.min(state.deckIndex, ranked.length - 1);
  const featured = ranked[cursor];
  const rest = ranked.filter((_, i) => i !== cursor);
  const seenAll = state.deckIndex >= ranked.length;

  return (
    <div className="screen screen--wide stack stack--lg">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="stack stack--sm">
          <span className="eyebrow">Your matches</span>
          <h1 style={{ fontSize: "30px" }}>{ranked.length} places share your look</h1>
        </div>
        <Button variant="ghost" onClick={() => dispatch({ type: "EDIT_VIBE" })}>
          Edit vibe
        </Button>
      </div>

      {seenAll ? (
        <div className="card">
          <div className="card__body">
            <strong>That&rsquo;s the whole deck.</strong>
            <p className="muted" style={{ margin: 0 }}>
              {state.savedTrips.length > 0
                ? "Compare what you saved, or start the deck over."
                : "Nothing saved yet — start over and pick a few."}
            </p>
            <div className="row">
              <Button variant="primary" onClick={() => dispatch({ type: "GO", screen: "saved" })}>
                See saved ({state.savedTrips.length})
              </Button>
              <Button onClick={() => dispatch({ type: "COMMIT_VIBE" })}>Start the deck over</Button>
            </div>
          </div>
        </div>
      ) : (
        <article className="card">
          <Art art={featured.trip.art} caption={`${featured.trip.city} — generated`} className="art--wide" />
          <div className="card__body">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong style={{ fontSize: "20px" }}>{featured.trip.city}</strong>
              <Chip tone="match">{featured.matchScore}%</Chip>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: "13px" }}>
              {featured.trip.region} · {featured.trip.idealStay[0]}–{featured.trip.idealStay[1]} nights
            </p>
            <p style={{ margin: 0 }}>{buildMatchLine(featured, constraints)}</p>
            <div className="row">
              {featured.reasons.map((r) => <Chip key={r}>{r}</Chip>)}
            </div>
            <p className="tabular" style={{ margin: 0, fontSize: "20px" }}>
              {money(basePerPerson(featured.trip, constraints))}{" "}
              <span className="muted" style={{ fontSize: "14px" }}>
                per person · as low as {money(bestPerPerson(featured.trip, constraints))} with hacks
              </span>
            </p>
            <EstimateBadge />
            <div className="row">
              <Button onClick={() => dispatch({ type: "ADVANCE_DECK" })}>Not for us</Button>
              <Button
                variant="primary"
                onClick={() =>
                  dispatch({ type: "SAVE_TRIP", tripId: featured.trip.id, savedAt: Date.now() })
                }
              >
                {isSaved(state, featured.trip.id) ? "Saved ✓" : "Save this one"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => dispatch({ type: "GO", screen: "detail", tripId: featured.trip.id })}
              >
                See the real cost →
              </Button>
            </div>
          </div>
        </article>
      )}

      <div className="stack stack--sm">
        <span className="eyebrow">The rest of your ranking</span>
        <div className="grid-2">
          {rest.map((r) => (
            <button
              key={r.trip.id}
              type="button"
              className="mini"
              onClick={() => dispatch({ type: "GO", screen: "detail", tripId: r.trip.id })}
            >
              <span className="mini__score"><Chip tone="match">{r.matchScore}%</Chip></span>
              <span className="mini__body">
                <strong>{r.trip.city}</strong>
                <span className="muted" style={{ fontSize: "12.5px" }}>{r.trip.region}</span>
                <span className="tabular" style={{ fontSize: "13px" }}>
                  {money(basePerPerson(r.trip, constraints))} pp
                </span>
              </span>
              {isSaved(state, r.trip.id) && <Chip>Saved</Chip>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
