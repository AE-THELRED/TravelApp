import { Chip } from "roamance";

// Every string here is real output: reasons come from scoring.js REASON_COPY,
// risks from the `risk` field on hacks in trips.json.

/** Match reasons. The default tone, and the one used most. */
export const Reasons = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
    <Chip>food-forward</Chip>
    <Chip>stays up late</Chip>
    <Chip>built for 3–4 nights</Chip>
    <Chip>gets you outside</Chip>
  </div>
);

/** The score. Coral, tabular, one per card — 62–97 is the real display range. */
export const MatchScores = () => (
  <div style={{ display: "flex", gap: "var(--space-2)" }}>
    <Chip tone="match">97%</Chip>
    <Chip tone="match">84%</Chip>
    <Chip tone="match">62%</Chip>
  </div>
);

/**
 * Risk chips — gold, and the reason gold exists. Each names what a saving
 * costs you, in the fewest words that stay concrete.
 */
export const Risks = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
    <Chip tone="risk">carry-on only</Chip>
    <Chip tone="risk">adds transit time</Chip>
    <Chip tone="risk">needs 3+ travelers</Chip>
    <Chip tone="risk">arrives late</Chip>
  </div>
);

/**
 * All three roles in one place. This is the cell that shows they are not
 * interchangeable: neutral describes the trip, coral scores it, gold warns.
 */
export const ThreeRoles = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
    <Chip tone="match">97%</Chip>
    <Chip>real beach time</Chip>
    <Chip tone="risk">carry-on only</Chip>
  </div>
);
