/**
 * Segmented — a small set of mutually exclusive choices.
 *
 * Used for the budget tier on onboarding and for sort order on the deck. This
 * is the one control in the set that earns being a component rather than a
 * class: it owns the `aria-pressed` bookkeeping, and getting that wrong is
 * invisible on screen and obvious to a screen reader.
 *
 * Keep it to 2–4 options. Past that it wants to be a <select>, which <Field>
 * already styles.
 *
 * @param {Object} props
 * @param {{value: string|number, label: string}[]} props.options
 * @param {string|number} props.value Currently selected option value.
 * @param {(value: string|number) => void} props.onChange
 * @param {string} [props.ariaLabel] Names the group for assistive tech.
 * @param {string} [props.className]
 */
export function Segmented({ options, value, onChange, ariaLabel, className = "" }) {
  return (
    <div className={`segmented ${className}`.trim()} role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default Segmented;
