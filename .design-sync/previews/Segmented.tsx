import { useState } from "react";
import { Segmented } from "roamance";

// Live state in every cell — Segmented owns the aria-pressed bookkeeping, and a
// frozen screenshot would not show that it actually tracks a selection.

/** The budget tier from onboarding. This value is the sole source of
 *  profile.budgetSensitivity, so it is the highest-stakes control in the app. */
export const BudgetTier = () => {
  const [tier, setTier] = useState<string | number>(2);
  return (
    <div style={{ maxWidth: "340px" }}>
      <Segmented
        ariaLabel="Budget"
        value={tier}
        onChange={setTier}
        options={[
          { value: 1, label: "Keep it cheap" },
          { value: 2, label: "Comfortable" },
          { value: 3, label: "Treat us" },
        ]}
      />
    </div>
  );
};

/** Deck sort order — three options, the upper end of what this control suits. */
export const SortOrder = () => {
  const [sort, setSort] = useState<string | number>("match");
  return (
    <div style={{ maxWidth: "340px" }}>
      <Segmented
        ariaLabel="Sort matches by"
        value={sort}
        onChange={setSort}
        options={[
          { value: "match", label: "Vibe match" },
          { value: "price", label: "Price" },
          { value: "length", label: "Length" },
        ]}
      />
    </div>
  );
};

/** Two options, where it reads most like a toggle. */
export const TwoOptions = () => {
  const [dates, setDates] = useState<string | number>("flexible");
  return (
    <div style={{ maxWidth: "260px" }}>
      <Segmented
        ariaLabel="Date flexibility"
        value={dates}
        onChange={setDates}
        options={[
          { value: "fixed", label: "Fixed dates" },
          { value: "flexible", label: "Flexible" },
        ]}
      />
    </div>
  );
};
