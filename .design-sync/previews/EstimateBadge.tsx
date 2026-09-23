import { EstimateBadge } from "roamance";

// The badge is small, so what these cells have to prove is not "does it
// render" but "is it legible next to the thing it qualifies". Every price
// shown here is real output from src/lib/cost.js for New Orleans, 2 travellers,
// 4 nights — the same numbers the trip detail screen renders.

/** On its own. The default label is the one that must appear beside any price. */
export const Default = () => <EstimateBadge />;

/**
 * The composition that actually ships: a cost, then the badge directly under
 * it. This is the pairing the product requires — a price without this label is
 * a bug, because every number in Roamance is invented.
 */
export const BesideAPrice = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
    <p className="tabular" style={{ fontSize: "26px", margin: 0 }}>
      $1,870{" "}
      <span className="muted" style={{ fontSize: "15px" }}>
        · $468 per person
      </span>
    </p>
    <EstimateBadge />
  </div>
);

/**
 * A longer label, on the landing screen where there is room to say what the
 * prototype does not do. Shows the badge wrapping without the dot detaching
 * from the first line.
 */
export const LongerLabel = () => (
  <div style={{ maxWidth: "340px" }}>
    <EstimateBadge>
      Estimated prototype data. No booking, no live pricing, no accounts.
    </EstimateBadge>
  </div>
);

/**
 * Inside a card, under a hacked total — the densest place it appears, and the
 * one where it most risks being lost against the surrounding copy.
 */
export const OnACard = () => (
  <div className="card" style={{ padding: "var(--space-4)", maxWidth: "320px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <strong>New Orleans</strong>
      <p className="tabular" style={{ margin: 0, fontSize: "18px" }}>
        <span className="muted" style={{ textDecoration: "line-through" }}>$1,870</span>{" "}
        $1,505
      </p>
      <span className="chip chip--risk">carry-on only</span>
      <EstimateBadge />
    </div>
  </div>
);
