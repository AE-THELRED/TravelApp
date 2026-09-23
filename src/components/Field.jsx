/**
 * Field — a labelled form control.
 *
 * Wraps a NATIVE <input> or <select>, which index.css already styles globally.
 * There is no <TextInput> in this design system on purpose: a native control
 * inside a <label> gets correct click-to-focus and screen-reader association
 * for free, and every custom input component in history has had to re-earn
 * both.
 *
 *   <Field label="Nights"><input type="number" value={n} onChange={...} /></Field>
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.children The native control.
 * @param {string} [props.className]
 */
export function Field({ label, children, className = "", ...rest }) {
  return (
    <label className={`field ${className}`.trim()} {...rest}>
      {label}
      {children}
    </label>
  );
}

export default Field;
