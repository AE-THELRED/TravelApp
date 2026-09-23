import { useMemo } from "react";
import trips from "../data/trips.json";
import Button from "../components/Button.jsx";
import Chip from "../components/Chip.jsx";
import EstimateBadge from "../components/EstimateBadge.jsx";
import { applyHacks, money } from "../lib/cost.js";

/**
 * The shortlist, side by side.
 *
 * Every figure here is recomputed from the saved trip's ids and its enabled
 * hack ids — nothing about money survives a reload, which is what keeps a
 * stale price from ever appearing next to a live toggle.
 */
export default function Saved({ state, dispatch }) {
  const { constraints } = state;

  const rows = useMemo(
    () =>
      state.savedTrips
        .map((saved) => {
          const trip = trips.find((t) => t.id === saved.tripId);
          if (!trip) return null;
          return { saved, trip, cost: applyHacks(trip, constraints, saved.selectedHackIds) };
        })
        .filter(Boolean),
    [state.savedTrips, constraints],
  );

  return (
    <div className="screen screen--wide stack stack--lg">
      <div className="stack stack--sm">
        <span className="eyebrow">Your shortlist</span>
        <h1 style={{ fontSize: "30px" }}>
          {rows.length === 0 ? "Nothing saved yet" : `${rows.length} saved`}
        </h1>
        {rows.length === 0 && (
          <p className="muted">Save a match from the deck and it shows up here, priced.</p>
        )}
      </div>

      {rows.length === 0 ? (
        <Button variant="primary" block onClick={() => dispatch({ type: "GO", screen: "matches" })}>
          Back to the deck
        </Button>
      ) : (
        <>
          <div className="grid-2">
            {rows.map(({ saved, trip, cost }) => (
              <article key={trip.id} className="card">
                <div className="card__body">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <strong>{trip.city}</strong>
                    {cost.savings > 0 && <Chip tone="match">−{money(cost.savings)}</Chip>}
                  </div>
                  <p className="muted" style={{ margin: 0, fontSize: "13px" }}>{trip.region}</p>

                  <p className="tabular" style={{ margin: 0, fontSize: "20px" }}>
                    {cost.savings > 0 && (
                      <span className="muted" style={{ fontSize: "15px", textDecoration: "line-through" }}>
                        {money(cost.baseTotal)}{" "}
                      </span>
                    )}
                    {money(cost.hackedTotal)}
                  </p>
                  <span className="muted" style={{ fontSize: "13px" }}>
                    {money(cost.perPerson)} per person
                  </span>

                  {cost.tradeoffs.length > 0 ? (
                    <div className="stack stack--sm">
                      <span className="eyebrow">What you traded for it</span>
                      {cost.tradeoffs.map((t) => (
                        <div key={t.title} className="traded">
                          <Chip tone="risk">{t.risk}</Chip>
                          <p style={{ margin: 0, fontSize: "13px" }}>{t.tradeoff}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="dim" style={{ margin: 0, fontSize: "12.5px" }}>
                      No hacks on — this is the straight price.
                    </p>
                  )}

                  <EstimateBadge />
                  <div className="row">
                    <Button onClick={() => dispatch({ type: "GO", screen: "detail", tripId: trip.id })}>
                      Adjust hacks
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => dispatch({ type: "UNSAVE_TRIP", tripId: saved.tripId })}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Button block onClick={() => dispatch({ type: "GO", screen: "matches" })}>
            Back to the deck
          </Button>
        </>
      )}
    </div>
  );
}
