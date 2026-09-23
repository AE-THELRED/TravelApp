/**
 * The "estimated prototype data" label — shared.
 *
 * Hard constraint: this appears wherever a price appears. Roamance shows no
 * live pricing and the interface must never imply otherwise.
 */
export function EstimateBadge({ children = "Estimated prototype data" }) {
  return <span className="estimate-badge">{children}</span>;
}

// Named export above is what the design-system bundle re-exports; the default
// keeps every existing `import EstimateBadge from` call site working unchanged.
export default EstimateBadge;
