import { useState } from "react";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import Segmented from "../components/Segmented.jsx";

/**
 * Onboarding — the constraints every later screen prices against.
 *
 * Local state until submit, deliberately: `constraints` is a dependency of
 * every useMemo downstream, so dispatching on each keystroke would re-rank the
 * whole deck on every character typed.
 *
 * `budgetTier` is the highest-stakes control here — it is the sole source of
 * profile.budgetSensitivity, which carries 25 of the 100 scoring points.
 */
export default function Onboarding({ state, dispatch }) {
  const existing = state.constraints;
  const [departure, setDeparture] = useState(existing?.departure ?? "Atlanta");
  const [destinationPref, setDestinationPref] = useState(existing?.destinationPref ?? "surprise");
  const [nights, setNights] = useState(existing?.nights ?? 4);
  const [adults, setAdults] = useState(existing?.adults ?? 2);
  const [children, setChildren] = useState(existing?.children ?? 0);
  const [budgetTier, setBudgetTier] = useState(existing?.budgetTier ?? 2);
  const [flexibleDates, setFlexibleDates] = useState(existing?.flexibleDates ?? true);

  function submit(event) {
    event.preventDefault();
    dispatch({
      type: "SET_CONSTRAINTS",
      payload: {
        departure: departure.trim() || "Atlanta",
        destinationPref,
        nights: clamp(nights, 1, 14),
        adults: clamp(adults, 1, 8),
        children: clamp(children, 0, 6),
        childAges: [],
        budgetTier,
        flexibleDates,
      },
    });
  }

  return (
    <form className="screen stack stack--lg" onSubmit={submit}>
      <div className="stack stack--sm">
        <span className="eyebrow">First, the practical bit</span>
        <h1 style={{ fontSize: "28px" }}>Who&rsquo;s going, and for how long?</h1>
        <p className="muted">
          This is what every price on the next screens is calculated from. Nothing here is sent
          anywhere.
        </p>
      </div>

      <Field label="Leaving from">
        <input type="text" value={departure} onChange={(e) => setDeparture(e.target.value)} />
      </Field>

      <Field label="Where to">
        <select value={destinationPref} onChange={(e) => setDestinationPref(e.target.value)}>
          <option value="surprise">Surprise me</option>
          <option value="region">A region I have in mind</option>
          <option value="specific">Somewhere specific</option>
        </select>
      </Field>

      <div className="grid-2">
        <Field label="Nights">
          <input type="number" min="1" max="14" value={nights} onChange={(e) => setNights(+e.target.value)} />
        </Field>
        <Field label="Adults">
          <input type="number" min="1" max="8" value={adults} onChange={(e) => setAdults(+e.target.value)} />
        </Field>
      </div>

      <Field label="Children">
        <input type="number" min="0" max="6" value={children} onChange={(e) => setChildren(+e.target.value)} />
      </Field>

      <div className="stack stack--sm">
        <span className="eyebrow">Budget</span>
        <Segmented
          ariaLabel="Budget"
          value={budgetTier}
          onChange={setBudgetTier}
          options={[
            { value: 1, label: "Keep it cheap" },
            { value: 2, label: "Comfortable" },
            { value: 3, label: "Treat us" },
          ]}
        />
      </div>

      <div className="stack stack--sm">
        <span className="eyebrow">Dates</span>
        <Segmented
          ariaLabel="Date flexibility"
          value={flexibleDates ? "flexible" : "fixed"}
          onChange={(v) => setFlexibleDates(v === "flexible")}
          options={[
            { value: "fixed", label: "Fixed" },
            { value: "flexible", label: "Flexible" },
          ]}
        />
        <p className="dim" style={{ fontSize: "12.5px" }}>
          Flexible dates unlock the shift-your-flight savings later. Fixed dates hide them rather
          than dangling something you can&rsquo;t use.
        </p>
      </div>

      <Button variant="primary" block type="submit">
        Next: pick your type
      </Button>
    </form>
  );
}

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(n) ? n : lo));
