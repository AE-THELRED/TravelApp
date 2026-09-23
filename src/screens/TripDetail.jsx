import { useMemo } from "react";
import trips from "../data/trips.json";
import Art from "../components/Art.jsx";
import Button from "../components/Button.jsx";
import Chip from "../components/Chip.jsx";
import EstimateBadge from "../components/EstimateBadge.jsx";
import { applyHacks, availableHacks, money } from "../lib/cost.js";
import { selectedHackIds, isSaved } from "../state/tripReducer.js";

/**
 * The true-cost card and the Hack Stack. This screen is the whole argument.
 *
 * Two rules it must never break:
 *   1. The tradeoff is rendered at the same weight as the saving. Not smaller,
 *      not greyed, not behind a disclosure.
 *   2. A hack whose requirement isn't met is not shown at all — a solo
 *      traveller never sees "split a two-bedroom".
 *
 * Costs are recomputed on every toggle. Nothing about money is stored.
 */
export default function TripDetail({ state, dispatch }) {
  const trip = trips.find((t) => t.id === state.activeTripId);
  const { constraints } = state;

  const enabled = selectedHackIds(state, trip?.id);
  const offered = useMemo(
    () => (trip ? availableHacks(trip, constraints) : []),
    [trip, constraints],
  );
  const cost = useMemo(
    () => (trip ? applyHacks(trip, constraints, enabled) : null),
    [trip, constraints, enabled],
  );

  if (!trip) {
    return (
      <div className="screen stack">
        <p className="muted">That trip isn&rsquo;t in the deck.</p>
        <Button onClick={() => dispatch({ type: "GO", screen: "matches" })}>Back to matches</Button>
      </div>
    );
  }

  const hidden = trip.hacks.length - offered.length;

  return (
    <div className="screen screen--wide stack stack--lg">
      <Button variant="ghost" onClick={() => dispatch({ type: "GO", screen: "matches" })}>
        ← Back to matches
      </Button>

      <article className="card">
        <Art art={trip.art} caption={`${trip.city} — generated`} className="art--wide" />
        <div className="card__body">
          <strong style={{ fontSize: "22px" }}>{trip.city}</strong>
          <p className="muted" style={{ margin: 0, fontSize: "13px" }}>{trip.region}</p>
          <p style={{ margin: 0 }}>{trip.tripBio}</p>
        </div>
      </article>

      <section className="card">
        <div className="card__body">
          <span className="eyebrow">What it actually costs</span>
          <table className="lines">
            <tbody>
              {cost.lines.map((line) => (
                <tr key={line.label}>
                  <td>
                    <strong>{line.label}</strong>
                    <span className="dim" style={{ display: "block", fontSize: "12px" }}>{line.note}</span>
                  </td>
                  <td className="tabular lines__amount">{money(line.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total">
            <div>
              <span className="dim" style={{ fontSize: "12.5px" }}>Trip total</span>
              <p className="tabular" style={{ margin: 0, fontSize: "26px" }}>
                {cost.savings > 0 && (
                  <span className="muted" style={{ fontSize: "17px", textDecoration: "line-through" }}>
                    {money(cost.baseTotal)}{" "}
                  </span>
                )}
                {money(cost.hackedTotal)}
              </p>
              <span className="muted" style={{ fontSize: "13px" }}>
                {money(cost.perPerson)} per person
              </span>
            </div>
            {cost.savings > 0 && <Chip tone="match">−{money(cost.savings)}</Chip>}
          </div>

          <p className="dim" style={{ fontSize: "12.5px", margin: 0 }}>
            Assumes: {trip.assumptions.baggage} {trip.assumptions.airportTransfer}
          </p>
          <EstimateBadge />
        </div>
      </section>

      <section className="stack stack--sm">
        <span className="eyebrow">The Hack Stack</span>
        <p className="muted" style={{ margin: 0 }}>
          Every one of these saves money. Every one of them costs you something. Both are below.
        </p>

        {offered.map((hack) => {
          const on = enabled.includes(hack.id);
          return (
            <article key={hack.id} className={`hack ${on ? "hack--on" : ""}`}>
              <label className="hack__head">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    dispatch({ type: "TOGGLE_HACK", tripId: trip.id, hackId: hack.id, savedAt: Date.now() })
                  }
                />
                <span>
                  <strong>{hack.title}</strong>
                  <span className="muted" style={{ display: "block", fontSize: "13px" }}>
                    {hack.description}
                  </span>
                </span>
                <Chip tone="risk">{hack.risk}</Chip>
              </label>
              <p className="hack__tradeoff">{hack.tradeoff}</p>
            </article>
          );
        })}

        {hidden > 0 && (
          <p className="dim" style={{ fontSize: "12.5px" }}>
            {hidden} more {hidden === 1 ? "hack doesn't" : "hacks don't"} apply to your party size or
            dates, so {hidden === 1 ? "it isn't" : "they aren't"} shown.
          </p>
        )}
      </section>

      <Button
        variant="primary"
        block
        onClick={() =>
          isSaved(state, trip.id)
            ? dispatch({ type: "GO", screen: "saved" })
            : dispatch({ type: "SAVE_TRIP", tripId: trip.id, savedAt: Date.now() })
        }
      >
        {isSaved(state, trip.id) ? "Saved — compare your shortlist" : "Save this trip"}
      </Button>
    </div>
  );
}
