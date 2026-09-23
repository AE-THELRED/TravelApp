import { Field } from "roamance";

// These are the onboarding screen's real controls. Field wraps NATIVE inputs —
// index.css styles input[type=text], input[type=number] and select globally, so
// there is no TextInput component to reach for.

/** A text field, as "Leaving from" renders it. */
export const Text = () => (
  <div style={{ maxWidth: "320px" }}>
    <Field label="Leaving from">
      <input type="text" defaultValue="Atlanta" />
    </Field>
  </div>
);

/** Two number fields in the two-column grid the form uses for party size. */
export const NumbersInAGrid = () => (
  <div className="grid-2" style={{ maxWidth: "320px" }}>
    <Field label="Nights">
      <input type="number" defaultValue={4} />
    </Field>
    <Field label="Adults">
      <input type="number" defaultValue={2} />
    </Field>
  </div>
);

/** A native select — the right control once a choice passes four options. */
export const Select = () => (
  <div style={{ maxWidth: "320px" }}>
    <Field label="Where to">
      <select defaultValue="surprise">
        <option value="surprise">Surprise me</option>
        <option value="specific">A specific place</option>
        <option value="region">A region</option>
      </select>
    </Field>
  </div>
);

/** The whole onboarding form, which is the only place all of these appear together. */
export const TheOnboardingForm = () => (
  <div style={{ maxWidth: "320px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <Field label="Leaving from">
      <input type="text" defaultValue="Atlanta" />
    </Field>
    <div className="grid-2">
      <Field label="Nights">
        <input type="number" defaultValue={4} />
      </Field>
      <Field label="Adults">
        <input type="number" defaultValue={2} />
      </Field>
    </div>
    <Field label="Where to">
      <select defaultValue="surprise">
        <option value="surprise">Surprise me</option>
        <option value="specific">A specific place</option>
      </select>
    </Field>
  </div>
);
