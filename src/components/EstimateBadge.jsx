/**
 * The "estimated prototype data" label — Person 4.
 *
 * Hard constraint: this appears wherever a price appears. Roamance shows no
 * live pricing and the interface must never imply otherwise.
 */
export default function EstimateBadge({ children = "Estimated prototype data" }) {
  return <span className="estimate-badge">{children}</span>;
}
